# SAS Educação - Workflow de Automação Experimental (n8n)

Repositório dedicado ao estudo técnico de integração de APIs, inspeção de tráfego HTTP e automação de fluxos utilitários utilizando a plataforma **n8n**. Este projeto foi desenvolvido estritamente para fins acadêmicos, de testes de estresse de rotas e validação de resiliência de endpoints REST.

---

## ⚠️ Aviso Legal e Recomendação de Uso

**ESTE SOFTWARE É FORNECIDO "COMO ESTÁ", APENAS PARA FINS EDUCACIONAIS E DE PESQUISA.**

* **Não utilize este workflow em ambientes de produção**, plataformas oficiais de ensino ou sistemas educacionais reais. O uso de scripts automatizados para interagir com plataformas de terceiros sem autorização prévia viola os Termos de Serviço (ToS) das respectivas instituições e pode resultar em sanções disciplinares, suspensão ou bloqueio definitivo de contas.
* O autor deste repositório **não se responsabiliza** pelo uso indevido, má conduta acadêmica ou quaisquer danos causados pela aplicação prática deste código fora de um ambiente controlado e isolado de testes.

---

## 🏗️ Arquitetura do Fluxo

O workflow implementa uma esteira de processamento sequencial e paralela dividida nas seguintes etapas lógicas:

1. **Extração de Parâmetros Globais**: Coleta de metadados da sessão, chaves de autenticação e identificadores de instâncias de atividades.
2. **Tratamento e Mapeamento de Payload**: Conversão e normalização de estruturas de dados para envio via requisições HTTP assíncronas.
3. **Dispatch de Respostas**: Iteração em lote (*batch processing*) simulando o envio de respostas para endpoints de validação.
4. **Finalização de Sessão**: Execução da rota de encerramento de caderno (`/finish`) com tratamento de códigos de resposta padrão (`204 No Content`).

---

## 🚀 Como Executar Localmente (Testes)

Para testar este fluxo em uma instância local de laboratório do n8n:

1. Suba uma instância isolada do n8n (recomenda-se o uso via Docker).
2. Importe o arquivo JSON contido neste repositório (`workflow.json`).
3. Certifique-se de substituir todas as credenciais reais, tokens de acesso (`Bearer`) e identificadores fixos por variáveis de ambiente ou dados fictícios de testes (`mock`).
