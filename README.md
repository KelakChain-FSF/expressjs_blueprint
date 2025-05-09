# Express.js + TypeScript Backend

This is a Node.js backend application built with Express.js, TypeScript, and modern development tools like Prisma, GraphQL, Swagger, Docker, and Husky. It provides a robust foundation for building scalable and maintainable APIs.

## Features

- Express.js: Fast and minimalist web framework for Node.js.

- TypeScript: Static typing for better code quality and developer experience.

- Prisma: Modern database toolkit for PostgreSQL.

- GraphQL: Optional GraphQL API alongside REST.

- Swagger: Automated API documentation.

- Docker: Containerized development and production environments.

- Husky: Git hooks for automated linting, formatting, and testing.

- Jest: Unit and integration testing.

- Redis: Caching layer for improved performance.

- Pino: Structured logging for better observability.

## Prerequisites

Before you begin, ensure you have the following installed:

Node.js (v18 or higher)

Yarn (v4.x)

Docker (v20 or higher)

Docker Compose (v2 or higher)

## Setup

### Environment Variables

Create a .env file in the root directory and add the following variables:

```sh
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
REDIS_URL="redis://localhost:6379"
```

## Available Script

Linting and Formatting

```sh
# Run ESLint to check for issues.
yarn lint 

# Run ESLint and automatically fix issues.
yarn lint:fix

# Format code with Prettier.
yarn format

```

Testing

```sh
#  Run unit and integration tests.
yarn test

#Run tests in watch mode.
yarn test:watch

```

Database

```sh
# Generate Prisma client.
yarn prisma:generate

# Run Prisma migrations.
yarn prisma:migrate

# Open Prisma Studio.
yarn prisma:studio
```

Swagger

```sh
#Generate swagger.json file.
yarn swagger:generate

#Automatically regenerate swagger.json on file changes.
yarn swagger:watch
```

Makefile

```sh
# to see makefile help 
make help
```
