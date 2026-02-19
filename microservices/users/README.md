# Users Microservice

Microsserviço de usuários e autenticação: registro, login e exposição do usuário autenticado. Expõe também um serviço gRPC interno para validação de existência de usuário (usado pelo Wallet).

## Tecnologias

- **Node.js** + **TypeScript**
- **NestJS** 11
- **TypeORM** + **PostgreSQL**
- **Passport** + **JWT** (autenticação HTTP)
- **gRPC** (servidor interno na porta 50051)
- **bcrypt** (hash de senha)
- **class-validator** / **class-transformer**
- **Jest** (testes)

## Como rodar

Na raiz do monorepo, com variáveis de ambiente configuradas (ex.: `.env` ou `.env.development`):

```bash
docker-compose up
```

O Users sobe junto com os demais serviços. Para rodar apenas o Users em modo desenvolvimento:

```bash
cd microservices/users
npm install
npm run start:dev
```

Requer PostgreSQL acessível.

## Endpoints HTTP

| Método | Path | Descrição |
|--------|------|-----------|
| POST | `/users` | Registro. Corpo: `{ "firstName", "lastName", "email", "password" }` (password mínimo 8 caracteres). Retorna `{ user, access_token }`. |
| POST | `/auth` | Login. Corpo: `{ "email", "password" }`. Retorna `{ user, access_token }`. |
| GET  | `/users/me` | Dados do usuário autenticado. Requer `Authorization: Bearer <token>`. |

## Serviço gRPC

- **Pacote**: `users_internal`
- **Serviço**: `UsersInternalService`
- **Porta**: `50051` (configurável via `USERS_GRPC_URL` no cliente)

### RPC

- **CheckUserExists**
  - **Request**: `{ user_id: string }`
  - **Response**: `{ exists: boolean }`
  - Usado pelo Wallet para validar usuário antes de criar transação. Pode exigir token interno (JWT) nos metadata da chamada.

## Variáveis de ambiente

| Variável | Descrição | Exemplo |
|----------|------------|---------|
| `USERS_PORT` | Porta HTTP | `3002` |
| `JWT_SECRET` | Chave para assinar/validar JWT das sessões HTTP | `ILIACHALLENGE` |
| `JWT_SECRET_INTERNAL` | Chave para validar JWT das chamadas gRPC internas | `ILIACHALLENGE_INTERNAL` |
| `DB_USERS_HOST` | Host do PostgreSQL | `users_db` |
| `DB_USERS_PORT` | Porta do PostgreSQL | `5432` |
| `DB_USERS_USER` | Usuário do banco | `user_challenge` |
| `DB_USERS_PASSWORD` | Senha do banco | `pass_challenge` |
| `DB_USERS_NAME` | Nome do banco | `users_db` |
| `USERS_GRPC_URL` | Endereço em que o servidor gRPC escuta (opcional) | `0.0.0.0:50051` |

## Arquitetura

O microsserviço segue **Clean Architecture** (DDD):

- **Domain**: entidade `User`, repositório `IUserRepository`, serviço de auth `IAuthService`.
- **Application**: use cases `RegisterUser` e `LoginUser`.
- **Infrastructure**: TypeORM (entidade, `UserRepository`), adaptador de auth (bcrypt + JwtService), estratégia Passport JWT, servidor gRPC (`UsersGrpcServerService`).
- **Presentation**: controller HTTP, DTOs com class-validator.

## Testes

```bash
cd microservices/users
npm run test
```

Cobertura:

```bash
npm run test:cov
```
