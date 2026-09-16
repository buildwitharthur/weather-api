# Padrão para schemas

## Objetivo

Centralizar os schemas Zod de query e response das rotas (validação, contratos e examples), para que os arquivos em `src/routes/` não fiquem com blocos grandes de `z.object()`. Este arquivo só diz respeito ao Zod — nada de `tags`, `description` ou `operationId`, isso é composição da rota e fica em `src/routes/`.

## Estrutura

- Uma pasta por tag da API, nomeada em `kebab-case` a partir da tag (ex.: `weather/` para a tag `"Weather"`, `health/` para `"Health"`).
- Dentro da pasta da tag, um arquivo por schema, nomeado em `kebab-case` a partir do nome exportado (ex.: `getWeatherQuerySchema` → `get-weather-query-schema.ts`).
- Exceção: `errorResponseSchema` é reutilizável entre tags, então fica fora de qualquer pasta de tag, direto em `src/schemas/error-response-schema.ts`.
- Um example grande de `.meta({ example })` vira uma constante não exportada no mesmo arquivo do schema que a usa; não crie um arquivo separado só para o example.
- Cada schema exportado termina em `Schema` (`getWeatherQuerySchema`, `getWeatherResponseSchema`, ...).

## Regras

- Aqui só existem `z.object()`/`z.array()`/etc. — schemas de `querystring` e de cada status de `response`. Nunca `tags`, `description`, `operationId` nem o objeto `schema` completo do `app.get`; isso é montado na própria rota, importando os schemas daqui.
- Reutilize `errorResponseSchema` e crie variantes específicas com `.meta({ example })` em vez de duplicar a estrutura só para mudar o exemplo (ex.: `city-not-found-response-schema.ts` exporta `cityNotFoundResponseSchema = errorResponseSchema.meta({...})`). Essas variantes moram na pasta da tag que as usa, não em `error-response-schema.ts`.
- Não duplicar schemas já existentes aqui; rotas que precisarem do mesmo contrato devem importar o arquivo existente.
- Manter os schemas simples e sem lógica de negócio; eles descrevem apenas formato de entrada/saída e examples.
- Remova arquivos de schema que ficarem sem nenhuma rota consumindo.
- Schemas aqui devem ser compatíveis com o type provider Zod configurado na aplicação, para gerar validação em runtime, documentação OpenAPI e a tipagem de `request` nas rotas automaticamente.
