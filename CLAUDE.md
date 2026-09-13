# Guia de estrutura do projeto

## Objetivo

API de clima baseada em TypeScript, Fastify, Redis e Zod. A organizacao deve manter responsabilidades separadas.

## Pastas

### `src/`

Contem o codigo-fonte da aplicacao. O ponto de entrada monta a aplicacao, registra plugins e inicia o servidor.

### `src/routes/`

Contem as rotas HTTP organizadas por dominio ou recurso. Cada rota deve ser um plugin Fastify independente.

### `src/lib/`

Contem integracoes e utilitarios compartilhados, como configuracao de ambiente, clientes externos e Redis.

## Docker Compose

Descreve o ambiente da aplicacao e suas dependencias de infraestrutura, como o Redis.

- Use o Compose para subir o ambiente completo.
- Configure healthchecks e ordem de inicializacao para servicos dependentes.
- Use volumes nomeados para dados persistentes.
- Passe configuracoes por variaveis de ambiente; nunca inclua credenciais.
- A API deve acessar dependencias pelo nome do servico na rede interna.

## Convencoes gerais

- Use TypeScript estrito e Zod para validacao de entrada e saida.
- Use somente arrow functions; nao declare funcoes com a sintaxe `function`.
- Nomeie arquivos e pastas usando `kebab-case`.
- Mantenha modulos pequenos e com responsabilidade clara.
- Mantenha segredos fora do codigo.
- Registre novas rotas no bootstrap da aplicacao.
- Documente endpoints com schemas e metadados OpenAPI.
- Execute formatter, linter e TypeScript antes de concluir alteracoes.
- Nao adicione logica de dominio ao arquivo de inicializacao do servidor.
