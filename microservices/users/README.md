# Users Microservice

User and authentication microservice: registration, login, and exposing the authenticated user. It also exposes an internal gRPC service for user existence validation (used by the Wallet).

## Technologies

- **Node.js** + **TypeScript**
- **NestJS** 11
- **TypeORM** + **PostgreSQL**
- **Passport** + **JWT** (HTTP authentication)
- **gRPC** (internal server on port 50051)
- **bcrypt** (password hashing)
- **class-validator** / **class-transformer**
- **Jest** (tests)

## How to run

From the monorepo root, with environment variables set (e.g. `.env` or `.env.dev`):

```bash
docker-compose up
```

Users runs together with the other services. To run only the Users microservice in development mode:

```bash
cd microservices/users
npm install
npm run start:dev
```

Requires PostgreSQL.

## HTTP endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/users` | Register. Body: `{ "firstName", "lastName", "email", "password" }` (password min 8 characters). Returns `{ user, access_token }`. |
| POST | `/auth` | Login. Body: `{ "email", "password" }`. Returns `{ user, access_token }`. |
| GET  | `/users/me` | Authenticated user data. Requires `Authorization: Bearer <token>`. |

## gRPC service

- **Package**: `users_internal`
- **Service**: `UsersInternalService`
- **Port**: `50051` (configurable via `USERS_GRPC_URL` on the client)

### RPC

- **CheckUserExists**
  - **Request**: `{ user_id: string }`
  - **Response**: `{ exists: boolean }`
  - Used by the Wallet to validate user before creating a transaction. May require an internal token (JWT) in the call metadata.

## Environment variables

| Variable | Description | Example |
|----------|-------------|---------|
| `USERS_PORT` | HTTP port | `3002` |
| `JWT_SECRET` | Key to sign/validate JWT for HTTP sessions | `ILIACHALLENGE` |
| `JWT_SECRET_INTERNAL` | Key to validate JWT for internal gRPC calls | `ILIACHALLENGE_INTERNAL` |
| `DB_USERS_HOST` | PostgreSQL host | `users_db` |
| `DB_USERS_PORT` | PostgreSQL port | `5432` |
| `DB_USERS_USER` | Database user | `user_challenge` |
| `DB_USERS_PASSWORD` | Database password | `pass_challenge` |
| `DB_USERS_NAME` | Database name | `users_db` |
| `USERS_GRPC_URL` | Address the gRPC server listens on (optional) | `0.0.0.0:50051` |

## Architecture

The microservice follows **Clean Architecture** (DDD):

- **Domain**: `User` entity, `IUserRepository` repository, `IAuthService` auth service.
- **Application**: `RegisterUser` and `LoginUser` use cases.
- **Infrastructure**: TypeORM (entity, `UserRepository`), auth adapter (bcrypt + JwtService), Passport JWT strategy, gRPC server (`UsersGrpcServerService`).
- **Presentation**: HTTP controller, DTOs with class-validator.

## Tests

```bash
cd microservices/users
npm run test
```

Coverage:

```bash
npm run test:cov
```
