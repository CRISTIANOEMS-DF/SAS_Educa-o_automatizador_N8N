const BASE_URL = "https://avl-activity-bff.arcotech.io";

// Token e accountId vêm do nó de autenticação
const auth = $('Code in JavaScript').first().json;
const staticData = $getWorkflowStaticData('global');
const token = auth.token || staticData.token;
const accountId = auth.accountId || staticData.accountId;

// Itens da lista de atividades (cada um tem .after com o id do agendamento)
const scheduleItems = $('Split Out').all();

const letters = ["A", "B", "C", "D", "E", "F", "G"];
const results = [];

const headers = {
  "Authorization": `Bearer ${token}`,
  "accountid": String(accountId),
  "Accept": "application/json, text/plain, */*",
  "Origin": "https://app.portalsaseducacao.com.br",
  "Referer": "https://app.portalsaseducacao.com.br/",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
};

for (let i = 0; i < scheduleItems.length; i++) {
  const after = scheduleItems[i]?.json?.after || {};
  const agendamentoId = after.id;          // ex.: 1490068 (id da lista)
  const title = after.title || "";

  if (!token || !agendamentoId) {
    results.push({
      json: {
        status: "skipped",
        reason: "Faltando token ou id do agendamento",
        received: { hasToken: !!token, agendamentoId, title }
      }
    });
    continue;
  }

  try {
    // PASSO 1: traduzir o id do agendamento nos IDs reais
    let mapeamento = await this.helpers.httpRequest({
      method: "GET",
      url: `${BASE_URL}/v1/schedules/${agendamentoId}`,
      headers,
      json: true,
      timeout: 15000
    });
    if (typeof mapeamento === "string") {
      try { mapeamento = JSON.parse(mapeamento); } catch {}
    }

    const activityId = mapeamento.testNotebookId;   // ← o activityId REAL
    const scheduleId = mapeamento.scheduleId;        // ← o scheduleId REAL
    const slug = mapeamento.activitySlug || title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const statusAgendamento = mapeamento.status;

    if (!activityId || !scheduleId) {
      results.push({
        json: {
          status: "skipped",
          reason: "Mapeamento sem testNotebookId/scheduleId",
          agendamentoId, title, mapeamento
        }
      });
      continue;
    }

    // PASSO 2: buscar o gabarito com os IDs corretos
    let data;
    const urlWithSlug = `${BASE_URL}/v1/test-notebook/${activityId}/results?scheduleId=${scheduleId}&slug=${slug}`;
    try {
      data = await this.helpers.httpRequest({
        method: "GET", url: urlWithSlug, headers, json: true, timeout: 15000
      });
    } catch (errSlug) {
      const urlFallback = `${BASE_URL}/v1/test-notebook/${activityId}/results?scheduleId=${scheduleId}`;
      data = await this.helpers.httpRequest({
        method: "GET", url: urlFallback, headers, json: true, timeout: 15000
      });
    }
    if (typeof data === "string") {
      try { data = JSON.parse(data); } catch {}
    }

    const questoesGabarito = (data?.questions || []).map((q, idx) => {
      const options = q.options || [];
      const correctIndex = options.findIndex(opt => opt.isCorrect === true);
      const correctOpt = correctIndex !== -1 ? options[correctIndex] : null;
      return {
        numero: idx + 1,
        questionId: q.id,
        order: q.questionOrder || (idx + 1),
        alternativaCorreta: correctIndex !== -1 ? (letters[correctIndex] || `Opção ${correctIndex + 1}`) : "N/A",
        optionIdCorreto: correctOpt ? correctOpt.id : null
      };
    });

    results.push({
      json: {
        status: "success",
        agendamentoId,
        activityId,
        scheduleId,
        slug,
        title,
        statusAgendamento,
        statusCaderno: data?.status || "UNKNOWN",
        totalQuestoes: questoesGabarito.length,
        gabarito: questoesGabarito
      }
    });

  } catch (err) {
    results.push({
      json: {
        status: "exception",
        error: err.message,
        agendamentoId,
        title
      }
    });
  }
}

return results;
