# Especificação de bbw-users

## Objetivo e responsabilidade

Fornecer perfis fictícios, endereços opcionais e preferências de clientes.

É dono dos perfis de clientes. Não autentica usuários reais nem armazena credenciais. Autenticação poderá ser especificada em uma etapa posterior.

Tecnologia: NestJS e TypeScript. Porta local proposta: `3001`. O armazenamento inicial, quando necessário, é em memória, recriado a partir de fixtures em cada inicialização. Persistência durável fica fora desta primeira entrega.

## Interface e regras de negócio

| Método e rota | Resposta esperada |
| --- | --- |
| `GET /health` | 200, `{"status":"ok"}` |
| `GET /users/:id` | 200, perfil; 404, `USER_NOT_FOUND` |
| `GET /users/:id/preferences` | 200, preferências efetivas; 404, `USER_NOT_FOUND` |

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
- Cada aplicação usa seu próprio projeto Sentry e identifica ambiente, release, serviço e cenário de ensaio.
- Contratos de erro esperados (4xx) não são falhas inesperadas por padrão. Os defeitos descritos devem gerar exceções reais, instrumentadas explicitamente.
- A implementação deve evitar captura duplicada da mesma exceção.

## Observabilidade

Inicializar o SDK apropriado antes da aplicação. Em TypeScript, publicar source maps associados à release. Em Go, capturar panics no limite HTTP, registrar a stack e retornar 500 sem derrubar o serviço; não presumir que a recuperação padrão de net/http envia eventos ao Sentry. No React, conectar o limite de erro ao SDK.

Correlacionar a requisição com a release e o cenário. Verificar a entrega do evento em ensaio real, aguardando a ingestão. Testes unitários não devem depender de Sentry ou credenciais reais.


## CI/CD independente

**CI previsto:** Instalação reprodutível pelo lockfile, lint, verificação de tipos, testes unitários e HTTP, build NestJS.

**CD previsto:** Imagem própria do serviço, configuração de ambiente e DSN próprios, deploy e rollback independentes.

O destino de hospedagem será escolhido posteriormente. O workflow de reparo recebe contexto do incidente, trabalha neste repositório e abre um PR. Os comandos de instalação e verificação serão adicionados junto à implementação; não há workflow de deploy executável nesta etapa.

## Critérios de entrega

- Implementar o caminho saudável de acordo com este contrato.
- Criar testes dos comportamentos esperados, incluindo entradas inválidas.
- Instrumentar falhas inesperadas e comprovar captura em um ambiente de demonstração.
- Implementar cenários isolados conforme `FALHAS.md`, preservando revisões reproduzíveis.
- Executar CI com ferramentas próprias desta tecnologia.
- Documentar execução local, configuração e encerramento de processos.
