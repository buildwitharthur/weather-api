# Weather API

API REST para consulta de clima atual e previsão por cidade.

## Sobre o projeto

A Weather API recebe o nome de uma cidade, localiza suas coordenadas, consulta um provedor externo de clima e retorna uma resposta padronizada.

O projeto utiliza Redis como cache para reduzir chamadas repetidas ao provedor e melhorar o tempo de resposta da API.

## Fluxo da aplicação

```text
Cliente
  ↓
Weather API
  ↓
Validação com Zod
  ↓
Redis Cache
  ↓
Geocoding
  ↓
Weather Provider
  ↓
Resposta normalizada
```

Caso os dados já estejam em cache, a API retorna a resposta diretamente sem consultar novamente o provedor externo.

## Executando localmente

Instale as dependências:

```bash
pnpm install
```

Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

Suba o Redis:

```bash
docker compose up -d redis
```

Execute a API:

```bash
pnpm dev
```

Para executar toda a aplicação com Docker:

```bash
docker compose up --build
```

A documentação da API fica disponível em:

```text
http://localhost:3000/docs
```
