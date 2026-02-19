# Wallet Microservice

Microsserviço de carteira digital responsável por armazenar e gerenciar transações financeiras dos usuários (crédito e débito), com autenticação JWT e integração ao microsserviço Users via gRPC para validação de usuário.

## Tecnologias

- **Node.js** + **TypeScript**
- **NestJS** 11
- **TypeORM** + **PostgreSQL**
- **Passport** + **JWT** (autenticação)
- **gRPC** (cliente para o microsserviço Users)
- **class-validator** / **class-transformer**
- **Jest** (testes)

## Como rodar

Na raiz do monorepo, com as variáveis de ambiente configuradas (ex.: `.env` ou `.env.development`):

```bash
docker-compose up
```

O Wallet sobe junto com os demais serviços (Wallet DB, Users, Users DB). Para rodar apenas o Wallet em modo desenvolvimento:

```bash
cd microservices/wallet
npm install
npm run start:dev
```

Requer PostgreSQL acessível e, para criação de transações, o microsserviço Users (gRPC) disponível.

## Endpoints

Todos os endpoints (exceto health, se existir) exigem **JWT** no header: `Authorization: Bearer <token>`.

| Método | Path | Descrição |
|--------|------|-----------|
| POST   | `/wallet/transactions` | Cria uma transação (CREDIT ou DEBIT). Corpo: `{ "amount": number, "type": "CREDIT" \| "DEBIT" }`. `userId` vem do token. |
| GET    | `/wallet/balance`      | Retorna o saldo consolidado do usuário autenticado. |
| GET    | `/wallet/transactions` | Lista transações do usuário. Query opcional: `?type=CREDIT` ou `?type=DEBIT`. |

As respostas HTTP são envelopadas no formato padrão do interceptor (metadata + data).

## Variáveis de ambiente

| Variável | Descrição | Exemplo |
|----------|------------|---------|
| `WALLET_PORT` | Porta HTTP do Wallet | `3001` |
| `JWT_SECRET` | Chave para validar JWT das requisições HTTP | `ILIACHALLENGE` |
| `JWT_SECRET_INTERNAL` | Chave para gerar JWT nas chamadas gRPC ao Users | `ILIACHALLENGE_INTERNAL` |
| `DB_WALLET_HOST` | Host do PostgreSQL do Wallet | `wallet_db` |
| `DB_WALLET_PORT` | Porta do PostgreSQL | `5432` |
| `DB_WALLET_USER` | Usuário do banco | `iliachallenge_user` |
| `DB_WALLET_PASSWORD` | Senha do banco | `iliachallenge_pass` |
| `DB_WALLET_NAME` | Nome do banco | `iliachallenge_db` |
| `USERS_GRPC_URL` | URL do servidor gRPC do Users (para CheckUserExists) | `users_app:50051` |

## Arquitetura

O microsserviço segue **Clean Architecture** (DDD):

- **Domain**: entidades (`Transaction`, `Wallet`), value objects (`Amount`), erros de domínio, interface do repositório (`IWalletRepository`).
- **Application**: use cases (`CreateTransactionUseCase`, `ListTransactionsUseCase`, `GetBalanceUseCase`), DTOs de aplicação.
- **Infrastructure**: TypeORM (entidades, `WalletRepository`), adaptador gRPC para o Users (`UsersGrpcAdapter`), auth (JWT strategy, guard).
- **Presentation**: controller HTTP, DTOs de entrada/saída com class-validator.

O padrão **Either** é usado para tratamento de erros nos use cases (ex.: `InvalidAmountError`, `UserNotFoundError`, `InsufficientBalanceError`).

## Testes

```bash
cd microservices/wallet
npm run test
```

Testes unitários com Jest. Cobertura:

```bash
npm run test:cov
```
