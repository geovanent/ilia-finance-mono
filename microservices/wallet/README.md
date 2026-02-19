# Wallet Microservice

Digital wallet microservice responsible for storing and managing user financial transactions (credit and debit), with JWT authentication and integration with the Users microservice via gRPC for user validation.

## Technologies

- **Node.js** + **TypeScript**
- **NestJS** 11
- **TypeORM** + **PostgreSQL**
- **Passport** + **JWT** (authentication)
- **gRPC** (client for the Users microservice)
- **class-validator** / **class-transformer**
- **Jest** (tests)

## How to run

From the monorepo root, with environment variables set (e.g. `.env` or `.env.dev`):

```bash
docker-compose up
```

The Wallet runs together with the other services (Wallet DB, Users, Users DB). To run only the Wallet in development mode:

```bash
cd microservices/wallet
npm install
npm run start:dev
```

Requires PostgreSQL and, for creating transactions, the Users microservice (gRPC) must be available.

## Endpoints

All endpoints (except health, if any) require **JWT** in the header: `Authorization: Bearer <token>`.

| Method | Path | Description |
|--------|------|-------------|
| POST   | `/wallet/transactions` | Create a transaction (CREDIT or DEBIT). Body: `{ "amount": number, "type": "CREDIT" \| "DEBIT" }`. `userId` is taken from the token. |
| GET    | `/wallet/balance`      | Returns the authenticated user's consolidated balance. |
| GET    | `/wallet/transactions` | List the user's transactions. Optional query: `?type=CREDIT` or `?type=DEBIT`. |

HTTP responses are wrapped in the standard interceptor format (metadata + data).

## Environment variables

| Variable | Description | Example |
|----------|-------------|---------|
| `WALLET_PORT` | Wallet HTTP port | `3001` |
| `JWT_SECRET` | Key to validate JWT on HTTP requests | `ILIACHALLENGE` |
| `JWT_SECRET_INTERNAL` | Key to generate JWT for gRPC calls to Users | `ILIACHALLENGE_INTERNAL` |
| `DB_WALLET_HOST` | Wallet PostgreSQL host | `wallet_db` |
| `DB_WALLET_PORT` | PostgreSQL port | `5432` |
| `DB_WALLET_USER` | Database user | `iliachallenge_user` |
| `DB_WALLET_PASSWORD` | Database password | `iliachallenge_pass` |
| `DB_WALLET_NAME` | Database name | `iliachallenge_db` |
| `USERS_GRPC_URL` | Users gRPC server URL (for CheckUserExists) | `users_app:50051` |

## Architecture

The microservice follows **Clean Architecture** (DDD):

- **Domain**: entities (`Transaction`, `Wallet`), value objects (`Amount`), domain errors, repository interface (`IWalletRepository`).
- **Application**: use cases (`CreateTransactionUseCase`, `ListTransactionsUseCase`, `GetBalanceUseCase`), application DTOs.
- **Infrastructure**: TypeORM (entities, `WalletRepository`), gRPC adapter for Users (`UsersGrpcAdapter`), auth (JWT strategy, guard).
- **Presentation**: HTTP controller, input/output DTOs with class-validator.

The **Either** pattern is used for error handling in use cases (e.g. `InvalidAmountError`, `UserNotFoundError`, `InsufficientBalanceError`).

## Tests

```bash
cd microservices/wallet
npm run test
```

Unit tests with Jest. Coverage:

```bash
npm run test:cov
```
