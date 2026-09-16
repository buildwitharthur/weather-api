# Padrão para criação de rotas

## Estrutura

Cada recurso HTTP deve ser implementado como um plugin Fastify.

Os arquivos de rota devem usar nomenclatura `kebab-case`, com nomes baseados no recurso ou dominio exposto.

```ts
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { resourceQuerySchema, resourceResponseSchema } from "../schemas/resource-schemas";

export const route: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/resource",
		{
			schema: {
				tags: ["Resource"],
				description: "Describes what this endpoint does.",
				operationId: "getResource",

				querystring: resourceQuerySchema,

				response: {
					200: resourceResponseSchema,
				},
			},
		},
		async (request) => {
			return {};
		},
	);
};
```

## Regras

- Use somente arrow functions nos plugins, handlers e callbacks.

- Separe rotas por recurso ou domínio; não agrupe endpoints sem relação.
- Use `FastifyPluginAsyncZod` e o type provider Zod configurado pela aplicação.
- Não declare `z.object()` de querystring/body/response na rota — os schemas Zod (`params`, `querystring`, `headers`, `body`, `response`) vêm de `src/schemas/` (ver seu `CLAUDE.md`).
- O objeto `schema` do `app.get` (`tags`, `description`, `operationId`, `querystring`, `response`) é montado aqui na rota, referenciando os schemas Zod importados — não existe um `xSchema` pronto vindo de `src/schemas/` para colar direto em `schema:`.
- A rota é só fluxo HTTP: receber a request, chamar `functions/`, checar condições e lançar `AppError`s quando necessário, montar a resposta de sucesso, e compor o schema acima com os pedaços Zod importados.
- Retorne somente dados necessários ao consumidor da API.
- Use códigos HTTP coerentes; erros previsíveis são `throw` de um `AppError` (o error handler global formata a resposta), não `reply.status(...).send(...)` manual.
- Coloque regras de negócio complexas em módulos de domínio ou `src/lib/`, não no handler.
- Acesse Redis e serviços externos por integrações compartilhadas.
- Não leia `process.env` diretamente em uma rota; use a configuração validada.
- Use nomes de caminhos REST consistentes e métodos HTTP semânticos.
- Registre o plugin no bootstrap da aplicação, mantendo o arquivo da rota independente.

## Documentação

`tags`, `description`, `operationId` e a composição do `response` ficam na rota; os schemas Zod (query/response) e os examples via `.meta()` ficam em `src/schemas/`. A documentação deve refletir o contrato real de entrada e saída.

## Verificação

Antes de finalizar uma rota, execute o formatter, o linter e o compilador TypeScript. Verifique também manualmente o endpoint e a especificação OpenAPI gerada.
