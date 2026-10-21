# Sentry — bbw-users

Organização: `bbdw-workshop`. Projeto: `bbw-users`. Repositório vinculado: `bbdw-gh-action/bbw-users`.

SDK `@sentry/node` inicializado antes do NestJS. O filtro HTTP captura respostas 5xx uma vez, mantendo os contratos e excluindo 4xx. O encerramento do Nest aguarda o envio pendente.

A configuração mantém apenas erros nesta etapa, sem replay, profiling ou logs. Requests, usuários e breadcrumbs são removidos antes do envio; os testes verificam a ausência de cabeçalhos, query e dados sintéticos privados.

## Configuração

Copie `.env.example` para `.env` e configure o DSN do projeto próprio, ambiente, release e identificador de execução. Nunca grave `SENTRY_AUTH_TOKEN` no repositório. Sem DSN, o envio fica desativado.

Use `SENTRY_DSN`, `SENTRY_ENVIRONMENT`, `SENTRY_RELEASE`, `DEMO_SCENARIO` e `DEMO_RUN_ID`. `npm start` e `npm run dev` carregam `.env`. Para mapas: `npm run build` e `npm run sentry:upload`, com `SENTRY_AUTH_TOKEN`, `SENTRY_ORG=bbdw-workshop` e `SENTRY_PROJECT=bbw-users` no ambiente. Use a mesma release na aplicação e no upload. Uma variável já exportada prevalece sobre `.env`; confira a organização antes do upload.

## Validação real — 21/10/2026

- Evento: [Error: BBW SDK validation users sdk-20261021-110837](https://bbdw-workshop.sentry.io/issues/7804712661/).
- ID: `20fddd7c913b4461a51efdeb0928f061`.
- Release exclusiva de teste: `bbw-users@sdk-20261021-110837`; ambiente `bbw-sdk-validation`, cenário `SDK-SMOKE`.
- Um evento observado no projeto correto, sem erros de processamento do Sentry.
- Stack: `app.ts:56`.
- A falha foi introduzida somente em uma cópia temporária da aplicação e percorreu a inicialização real e o tratamento de erros. Nenhuma rota ou falha de teste foi adicionada à aplicação versionada.
- Os processos temporários foram encerrados. Este registro não representa deploy remoto nem execução do agente de reparo.

## Checks

`npm run check`: lint, tipos e quatro testes aprovados; duas requisições simultâneas geram eventos separados, e 404 não gera evento. Source maps confirmados com contexto TypeScript no Sentry.
