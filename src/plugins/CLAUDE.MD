# Padrão para plugins

## Objetivo

Concentrar a configuração de plugins do Fastify e de comportamentos globais da aplicação (CORS, rate limit, documentação OpenAPI, error handler, etc), mantendo o arquivo de bootstrap (`server.ts`) livre de detalhes de configuração.

## Estrutura

- Um arquivo por plugin ou por responsabilidade de configuração global, nomeado em `kebab-case` a partir do que ele configura (ex.: `rate-limit.ts`, `error-handler.ts`).
- Cada arquivo exporta uma única função `register*` (ex.: `registerCors`, `registerRateLimit`, `registerDocs`, `registerErrorHandler`) que recebe a instância do Fastify (`FastifyInstance`) e aplica a configuração correspondente.

## Regras

- Use somente arrow functions; não declare funções com a sintaxe `function`.
- Cada função `register*` deve apenas configurar o plugin/comportamento; não conter lógica de domínio ou regras de negócio.
- `server.ts` deve apenas importar e chamar as funções `register*`, na ordem correta de inicialização; não deve conter as opções de configuração dos plugins diretamente.
- Rotas de aplicação (recursos de domínio) não pertencem a esta pasta; ficam em `src/routes/`. Aqui ficam apenas plugins de infraestrutura/transversais e rotas auxiliares que os acompanham (ex.: `/openapi.json` junto do plugin de docs).
- Segredos e valores de configuração sensíveis não devem ser hardcoded aqui; use a configuração de ambiente validada em `src/lib/env.ts`.
