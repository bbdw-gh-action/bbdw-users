# Sentry — bbdw-users

SDK `@sentry/node` inicializado antes do NestJS. O filtro HTTP captura respostas 5xx uma vez, mantendo os contratos e excluindo 4xx. O encerramento do Nest aguarda o envio pendente.

A configuração mantém apenas erros nesta etapa, sem replay, profiling ou logs. Requests, usuários e breadcrumbs são removidos antes do envio; os testes verificam a ausência de cabeçalhos, query e dados sintéticos privados.

## Configuração

Copie `.env.example` para `.env` e configure o DSN do projeto próprio, ambiente, release e identificador de execução. Nunca grave `SENTRY_AUTH_TOKEN` no repositório. Sem DSN, o envio fica desativado.

Use `SENTRY_DSN`, `SENTRY_ENVIRONMENT`, `SENTRY_RELEASE`, `DEMO_SCENARIO` e `DEMO_RUN_ID`. `npm start` e `npm run dev` carregam `.env`. Para mapas: `npm run build` e `npm run sentry:upload -- ../bbdw-users` no Patchwork, com `SENTRY_AUTH_TOKEN`, `SENTRY_ORG=bbdw-workshop-jj` e `SENTRY_PROJECT=bbdw-users` no ambiente. Use a mesma release na aplicação e no upload. Uma variável já exportada prevalece sobre `.env`; confira a organização antes do upload.

O upload é mantido no [Patchwork](https://github.com/bb-dw-26/patchwork/blob/main/docs/SOURCEMAPS.md). Execute o build neste app e o comando de publicação a partir do checkout do Patchwork; ele carrega o `.env` da pasta indicada.
