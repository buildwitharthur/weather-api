# Padrão para utilitários genéricos

## Objetivo

Guardar funções auxiliares puras e reutilizáveis, sem conhecimento de domínio, de infraestrutura específica ou de serviços externos. Servem para remover duplicação entre `functions/`, `routes/` e `plugins/`.

## Estrutura

- Um arquivo por utilitário (ou por grupo pequeno e coeso de utilitários relacionados), nomeado em `kebab-case` a partir do que ele faz (ex.: `cache-keys.ts`, `cache-ttl.ts`).
- Cada arquivo exporta funções/constantes nomeadas; não usar `export default`.

## Regras

- Use somente arrow functions; não declare funções com a sintaxe `function`.
- Um utilitário não deve conhecer classes de erro de domínio (`AppError` e subclasses), Fastify, Redis ou qualquer client HTTP específico (Open-Meteo, etc). Comportamento específico de domínio (qual erro lançar, qual TTL usar em qual caso) é decidido por quem chama o utilitário, não pelo utilitário em si.
- Utilitários que precisam sinalizar falha devem receber o comportamento de falha via parâmetro (callback, ex.: `onFailure`), nunca lançar um erro de domínio diretamente.
- Não colocar aqui integrações com serviços externos (isso pertence a `src/lib/`) nem lógica de rota (isso pertence a `src/routes/`).
- Mantenha cada utilitário pequeno, previsível e fácil de testar isoladamente.
