# Padrão para integrações

## Objetivo

Guardar exclusivamente integrações com serviços externos e seus clients (ex.: Redis, futuramente outros serviços de infraestrutura). Não é o lugar para funções auxiliares genéricas nem para lógica de domínio.

## Estrutura

- Um arquivo por serviço/integração, nomeado em `kebab-case` a partir do serviço (ex.: `redis.ts`).
- Cada arquivo expõe o client configurado e/ou as funções que encapsulam sua comunicação com o serviço externo (ex.: `getRedisData`, `saveRedisData`).

## Regras

- Use somente arrow functions; não declare funções com a sintaxe `function`.
- Só entra aqui código que efetivamente se comunica com um serviço externo (rede, banco, cache, fila, etc). Constantes, geradores de chave, formatadores e outras funções auxiliares genéricas pertencem a `src/utils/`.
- Erros de comunicação com o serviço externo devem ser tratados aqui, sem propagar para o restante da aplicação como falha obrigatória (ex.: indisponibilidade do Redis não deve derrubar uma requisição que depende dele apenas como otimização).
- Não lançar classes de erro de domínio (`AppError` e subclasses) a partir daqui; isso é responsabilidade das `functions/` e `routes/` que decidem o que uma falha de integração significa para o fluxo de negócio.
- Não acessar o client de uma integração (ex.: instância do `ioredis`) diretamente fora deste módulo; sempre pelas funções exportadas aqui.
- Segredos e endpoints vêm da configuração de ambiente validada (`env.ts`), nunca hardcoded.
