# Padrão para schemas compartilhados

## Objetivo

Guardar schemas Zod reutilizáveis por múltiplas rotas, evitando duplicação de definições de validação e de documentação OpenAPI.

## Estrutura

- Um arquivo por schema (ou por grupo coeso de schemas relacionados), nomeado em `kebab-case` a partir do nome exportado (ex.: `errorResponseSchema` → `error-response-schema.ts`).
- Cada arquivo exporta o schema como uma constante nomeada, terminando em `Schema`.

## Regras

- Só pertence a esta pasta o schema usado por mais de uma rota, ou que representa um contrato transversal da API (como o formato padronizado de erro).
- Schemas específicos de uma única rota continuam declarados no próprio arquivo da rota.
- Não duplicar schemas já existentes aqui; rotas devem importar e compor os schemas desta pasta em vez de redeclarar a mesma forma.
- Manter os schemas simples e sem lógica de negócio; eles descrevem apenas formato de entrada/saída.
- Schemas aqui devem ser compatíveis com o type provider Zod configurado na aplicação, para gerar validação em runtime e documentação OpenAPI automaticamente.
