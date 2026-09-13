const results = [];
const incomingItems = typeof $input !== 'undefined' ? $input.all() : items;

for (const item of incomingItems) {
  const data = item.json;
  
  let questoes = data.gabarito;
  if (typeof questoes === 'string') {
    try { questoes = JSON.parse(questoes); } catch (e) { questoes = []; }
  }

  if (Array.isArray(questoes)) {
    for (const q of questoes) {
      results.push({
        json: {
          token: data.token,
          accountId: data.accountId,
          classroomId: data.classroomId,
          agendamentoId: data.agendamentoId,
          referenceId: data.activityId || data.referenceId,
          scheduleId: data.scheduleId,
          slug: data.slug,
          questionId: String(q.questionId),
          optionIdCorreto: String(q.optionIdCorreto),
          alternativaCorreta: String(q.alternativaCorreta || 'A').toUpperCase(),
          order: Number(q.order || q.numero || 1)
        }
      });
    }
  }
}

return 