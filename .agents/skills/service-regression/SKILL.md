---
name: service-regression
description: Reproduzir e validar correções de incidentes em bbdw-users usando os contratos e testes específicos deste serviço.
---

Leia `docs/SPEC.md` e `docs/FALHAS.md`. O escopo autorizado de produção é `src/app.ts`; adicione testes novos que correspondam a `^test/patchwork-[a-z0-9-]+\.test\.ts$`. A configuração confiável do Patchwork fica em `.github/patchwork.json`.

GET /users/:id deve retornar o cliente fictício ou 404 USER_NOT_FOUND. Preserve o envelope de erro, request ID e endereço nulo. Não implemente endpoints de preferências apenas porque constam como cenário planejado.

Comandos de verificação: npm run build; node --test dist/test/patchwork-<nome>.test.js; npm run check. Execute primeiro o teste novo contra o código original e registre a falha funcional. Depois aplique a correção e execute as verificações completas. Não substitua testes por alterações em fixtures ou na telemetria.

Use o MCP `sentry` para o projeto `bbdw-users` da organização `bbdw-workshop-jj`; consulte o evento e a release informados no prompt. A skill compartilhada `patchwork-investigation` é disponibilizada pelo workflow junto com esta pasta.

As falhas planejadas na documentação não autorizam introduzir defeitos na aplicação. Corrija somente o incidente recebido. Relate se consultou `docs/SOLUCOES.md` e encerre processos de teste iniciados.
