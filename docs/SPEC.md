# Especificação de bbw-users

## Escopo da apresentação de 50 minutos

A apresentação tem **50 minutos** e começa com a aplicação já executando a revisão defeituosa de **CHK-001**. A primeira compra revela a falha; a meta é iniciar Sentry → issue no checkout → workflow nos primeiros **5 minutos**.

Enquanto o agente trabalha em segundo plano, apresentar a arquitetura, o YAML do workflow, o contexto do incidente e os critérios de validação. Retomar os resultados por volta do minuto 30, sem acompanhar logs continuamente. Os cerca de 25 minutos disponíveis não são garantia de conclusão.

**Prioridades:** CHK-001 é o único cenário obrigatório; CAT-001 é reserva opcional, preparada apenas depois do fluxo principal; USR-001, USR-002, CAT-002, CHK-002, WEB-001 e WEB-002 são material complementar. Nenhum cenário adicional bloqueia a entrega.

Manter quatro aplicações pequenas, dados fictícios em memória, HTTP/JSON e CI/CD próprio por repositório. Autenticação real, banco de dados, pagamentos, mensageria, reparos entre repositórios e múltiplos agentes ficam fora desta entrega.

**Papel deste repositório:** Dependência saudável: servir os dois clientes fictícios e seus endereços por GET /users/:id. Preferências e falhas próprias ficam como material complementar.

[Roteiro completo e contingência](https://github.com/bbdw-gh-action/bbw-storefront/blob/main/docs/ROTEIRO.md).

## Objetivo e responsabilidade

Fornecer perfis fictícios, endereços opcionais e preferências de clientes.

É dono dos perfis de clientes. Não autentica usuários reais nem armazena credenciais. Autenticação poderá ser especificada em uma etapa posterior.

Tecnologia: NestJS e TypeScript. Porta local proposta: `3001`. O armazenamento inicial, quando necessário, é em memória, recriado a partir de fixtures em cada inicialização. Persistência durável fica fora desta primeira entrega.

## Interface e regras de negócio

| Método e rota | Resposta esperada |
| --- | --- |
| `GET /health` | 200, `{"status":"ok"}` |
| `GET /users/:id` | 200, perfil; 404, `USER_NOT_FOUND` |
| `GET /users/:id/preferences` | Complementar, fora da entrega: 200, preferências efetivas; 404, `USER_NOT_FOUND` |

Perfil de exemplo:

```json
{"id":"customer-pickup","name":"Cliente Retirada","address":null}
```

Um endereço presente tem `postalCode`, `street` e `city`. Preferências efetivas têm `emailNotifications` e `smsNotifications`, ambos booleanos. Ausência de preferências armazenadas significa ambos `false`, sem alteração implícita do cadastro.

As fixtures em `specs/fixtures.json` são dados de entrada para implementação e testes, não endpoints já disponíveis.

## Contratos comuns

- HTTP/JSON, IDs como strings, valores monetários em centavos inteiros e moeda BRL.
- Envelope de erro: `{"error":{"code":"CODIGO_ESTAVEL","message":"Mensagem legível"},"requestId":"identificador"}`.
- Propagar `X-Request-ID` nas chamadas e respostas; gerar um identificador quando ausente.
- Dados exclusivamente fictícios. Não incluir tokens, cabeçalhos de autenticação ou dados pessoais reais nos eventos.
- O checkout deve ter projeto Sentry próprio e identificar ambiente, release, serviço e cenário. A instrumentação dos demais serviços é posterior; se adicionada, usar projetos próprios.
- Contratos de erro esperados (4xx) não são falhas inesperadas por padrão. Os defeitos descritos devem gerar exceções reais, instrumentadas explicitamente.
- A implementação deve evitar captura duplicada da mesma exceção.

## Observabilidade

Para CHK-001, instrumentar o checkout, publicar source maps associados à release e comprovar o envio de uma exceção real ao Sentry. Propagar o request ID pelos serviços e evitar eventos duplicados. Testes automatizados usam clientes simulados, sem credenciais reais.

Users e catalog devem permanecer saudáveis; a interface mostra o erro retornado pelo checkout e permite repetir a mesma compra após o reparo. A instrumentação Sentry própria desses três repositórios não é requisito desta apresentação.

Se CAT-001 for preparado como reserva, instrumentar a recuperação do panic HTTP no Go para capturar stack e retornar 500 sem derrubar o serviço. Essa preparação é opcional e ocorre depois da conclusão do cenário principal.

## CI/CD independente

**CI previsto:** Instalação reprodutível pelo lockfile, lint, verificação de tipos, testes unitários e HTTP, build NestJS.

**CD previsto:** Imagem própria do serviço, configuração de ambiente, deploy e rollback independentes. DSN próprio somente quando a instrumentação opcional for adicionada.

O destino de hospedagem será escolhido posteriormente. O workflow de reparo do checkout recebe o incidente CHK-001 e abre um PR no checkout. Workflows equivalentes nos outros repositórios ficam para uma etapa posterior. Os comandos de instalação e verificação serão adicionados junto à implementação; não há workflow de deploy executável nesta etapa.

## Critérios de entrega para os 50 minutos

- Dependência saudável: servir os dois clientes fictícios e seus endereços por GET /users/:id. Preferências e falhas próprias ficam como material complementar.
- Validar os contratos usados pela compra principal e os casos vizinhos necessários à correção.
- Manter build, testes e deploy independentes deste repositório.
- Ensaiar a compra com as quatro versões fixadas e registrar request ID e releases.
- Preparar um resultado anterior de CHK-001, identificado como ensaio, para a contingência.
- Documentar execução local e encerramento dos processos.

Para checkout, a entrega exige CHK-001 reproduzível, evento Sentry, issue, execução do agente, PR com teste falhando antes e passando depois e repetição da compra corrigida. Para os demais repositórios, a entrega exige suportar essa jornada de forma saudável. As soluções e falhas complementares continuam públicas para exploração posterior, sem obrigação de implementação nesta etapa.
