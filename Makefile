# Variables
DOCKER_COMPOSE = docker compose
DOCKER = docker
YARN = yarn

# Application Commands
start:
	$(YARN) start

build:
	$(YARN) build

dev:
	$(YARN) dev

prisma-generate:
	$(YARN) prisma:generate

prisma-migrate:
	$(YARN) prisma:migrate

prisma-studio:
	$(YARN) prisma:studio

test:
	$(YARN) test

test-watch:
	$(YARN) test:watch

lint:
	$(YARN) lint

lint-fix:
	$(YARN) lint:fix

format:
	$(YARN) format

prepare:
	$(YARN) prepare

# Docker Commands
docker-build:
	$(DOCKER_COMPOSE) build

docker-up:
	$(DOCKER_COMPOSE) up

docker-down:
	$(DOCKER_COMPOSE) down

docker-up-detached:
	$(DOCKER_COMPOSE) up -d

docker-logs:
	$(DOCKER_COMPOSE) logs -f

docker-restart:
	$(DOCKER_COMPOSE) restart

docker-prisma-migrate:
	$(DOCKER_COMPOSE) exec app $(YARN) prisma:migrate

docker-prisma-studio:
	$(DOCKER_COMPOSE) exec app $(YARN) prisma:studio

# Cleanup Commands
clean:
	rm -rf dist node_modules

docker-clean:
	$(DOCKER_COMPOSE) down -v --rmi all

# Help Command
help:
	@echo "Available commands:"
	@echo "  make start               - Start the application"
	@echo "  make build               - Build the TypeScript project"
	@echo "  make dev                 - Run the application in development mode"
	@echo "  make prisma-generate     - Generate Prisma client"
	@echo "  make prisma-migrate      - Run Prisma migrations"
	@echo "  make prisma-studio       - Open Prisma Studio"
	@echo "  make test                - Run tests"
	@echo "  make test-watch          - Run tests in watch mode"
	@echo "  make lint                - Run ESLint"
	@echo "  make lint-fix            - Run ESLint and fix issues"
	@echo "  make format              - Format code with Prettier"
	@echo "  make prepare             - Set up Husky"
	@echo ""
	@echo "Docker commands:"
	@echo "  make docker-build        - Build Docker images"
	@echo "  make docker-up           - Start Docker containers"
	@echo "  make docker-down         - Stop Docker containers"
	@echo "  make docker-up-detached  - Start Docker containers in detached mode"
	@echo "  make docker-logs         - View Docker container logs"
	@echo "  make docker-restart      - Restart Docker containers"
	@echo "  make docker-prisma-migrate - Run Prisma migrations in Docker"
	@echo "  make docker-prisma-studio  - Open Prisma Studio in Docker"
	@echo ""
	@echo "Cleanup commands:"
	@echo "  make clean               - Remove dist and node_modules"
	@echo "  make docker-clean        - Stop and remove all Docker containers, volumes, and images"
	@echo ""
	@echo "  make help                - Show this help message"