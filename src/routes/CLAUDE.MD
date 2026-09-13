# Padrão para criação de rotas

## Estrutura

Cada recurso HTTP deve ser implementado como um plugin Fastify.

Os arquivos de rota devem usar nomenclatura `kebab-case`, com nomes baseados no recurso ou dominio exposto.

```ts
import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";

export const route: FastifyPluginAsync = async (app) => {
	app.get(
		"/resource",
		{
			schema: {
				querystring: z.object({}),
				response: { 200: z.object({}) },
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
- Use `FastifyPluginAsync` e o type provider Zod configurado pela aplicação.
- Declare schemas para `params`, `querystring`, `headers`, `body` e `response` quando aplicável.
- Use os schemas para gerar validação em runtime e documentação OpenAPI.
- Retorne somente dados necessários ao consumidor da API.
- Use códigos HTTP coerentes e trate erros previsíveis com respostas padronizadas.
- Coloque regras de negócio complexas em módulos de domínio ou `src/lib/`, não no handler.
- Acesse Redis e serviços externos por integrações compartilhadas.
- Não leia `process.env` diretamente em uma rota; use a configuração validada.
- Use nomes de caminhos REST consistentes e métodos HTTP semânticos.
- Registre o plugin no bootstrap da aplicação, mantendo o arquivo da rota independente.

## Documentação

Descreva cada endpoint por meio de `summary`, `description`, `tags` e `operationId` no schema quando esses metadados forem relevantes. A documentação deve refletir o contrato real de entrada e saída.

## Verificação

Antes de finalizar uma rota, execute o formatter, o linter e o compilador TypeScript. Verifique também manualmente o endpoint e a especificação OpenAPI gerada.
