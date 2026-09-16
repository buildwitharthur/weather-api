# Padrão para erros de domínio

## Objetivo

Centralizar os erros previsíveis da aplicação em classes tipadas, para que o error handler global do Fastify consiga tratá-los de forma uniforme sem que as rotas precisem conhecer status HTTP ou formato de resposta.

## Estrutura

- `app-error.ts` contém a classe base `AppError`, que estende `Error` e carrega `code`, `statusCode` e `message`.
- Cada erro de domínio é uma classe própria que estende `AppError`, definindo `code`, `statusCode` e `message` fixos no construtor.
- Um arquivo por classe de erro, nomeado em `kebab-case` a partir do nome da classe (ex.: `CityNotFoundError` → `city-not-found-error.ts`).

## Regras

- Não lançar `AppError` diretamente nas rotas ou funções; sempre criar/usar uma classe específica.
- `code` deve ser uma string estável em `UPPER_SNAKE_CASE`, usada como identificador do erro na resposta da API.
- `statusCode` deve refletir o significado HTTP real do erro (404 para recurso não encontrado, 503 para dependência externa indisponível, etc).
- `message` deve ser uma mensagem segura para expor ao cliente; nunca incluir detalhes internos, stack trace ou dados sensíveis.
- Erros de domínio são lançados com `throw` nas rotas ou funções de integração; a captura e formatação da resposta são responsabilidade exclusiva do error handler global, não das rotas.
- Erros inesperados (que não são `AppError`) não pertencem a esta pasta; eles são tratados de forma genérica pelo error handler.
- Use somente arrow functions e classes; não declare funções com a sintaxe `function`.
