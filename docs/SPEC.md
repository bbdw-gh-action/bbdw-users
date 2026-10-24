# Especificação de bbdw-users

## Escopo técnico

Aplicação com dados fictícios em memória, contratos HTTP/JSON, build e CI próprios. Autenticação real, banco de dados, pagamentos e mensageria ficam fora do escopo.

## Objetivo e responsabilidade

Fornecer perfis fictícios e endereços opcionais de clientes.

É dono dos perfis de clientes. Não autentica usuários reais nem armazena credenciais.

Tecnologia: NestJS e TypeScript. Porta local padrão: `3001`. Os perfis são carregados de `specs/fixtures.json`, sem persistência de alterações.

## Interface e regras de negócio

| Método e rota | Resposta esperada |
| --- | --- |
| `GET /health` | 200, `{"status":"ok"}` |
| `GET /users/:id` | 200, perfil; 404, `USER_NOT_FOUND` |

Perfil de exemplo:

```json
{"id":"customer-pickup","name":"Cliente Retirada","address":null}
```

Um endereço presente tem `postalCode`, `street` e `city`.

## Contratos comuns

- HTTP/JSON, IDs como strings, valores monetários em centavos inteiros e moeda BRL.
- Envelope de erro: `{"error":{"code":"CODIGO_ESTAVEL","message":"Mensagem legível"},"requestId":"identificador"}`.
- Propagar `X-Request-ID` nas chamadas e respostas; gerar um identificador quando ausente.
- Dados exclusivamente fictícios. Não incluir tokens, cabeçalhos de autenticação ou dados pessoais reais nos eventos.
- Cada serviço possui projeto Sentry próprio e identifica ambiente, release e serviço. Consulte [SENTRY.md](SENTRY.md).
- Contratos de erro esperados (4xx) não são falhas inesperadas por padrão. Exceções inesperadas devem ser instrumentadas explicitamente.
- A implementação deve evitar captura duplicada da mesma exceção.

## Observabilidade

Cada serviço usa projeto Sentry próprio. Identificar ambiente, release e serviço; propagar o request ID e evitar eventos duplicados. Publicar source maps associados à mesma release nos projetos TypeScript. Testes de telemetria usam coletores locais, sem credenciais reais.

## Build e CI

`npm ci` e `npm run check` verificam lint, tipos, build e testes HTTP. O workflow [ci.yml](../.github/workflows/ci.yml) também verifica o build da imagem Docker.

Os comandos locais estão no [README](../README.md). A imagem é construída pelo [Dockerfile](../Dockerfile); não há workflow de deploy remoto configurado neste repositório.

## Automação compartilhada

Integração com o Patchwork configurada no workflow local. Consulte [operação, skills e MCP](PATCHWORK.md).
