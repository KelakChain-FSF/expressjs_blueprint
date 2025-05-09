FROM node:22-alpine

# Create a new user and group
# RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN apk add --no-cache postgresql-client curl redis

RUN corepack enable
WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./

RUN corepack prepare yarn@4.6.0 --activate
RUN mkdir -p /app/node_modules
RUN yarn install --immutable 

COPY . .
COPY /scripts/wait-for-postgres.sh /app/scripts/wait-for-postgres.sh
RUN chmod +x /app/scripts/wait-for-postgres.sh

ENV NODE_PATH=/app/node_modules
ENV PATH=$NODE_PATH/.bin:$PATH

# Wait for PostgreSQL to be ready and run Prisma migrations
# RUN /app/scripts/wait-for-postgres.sh

RUN yarn build

EXPOSE 3000

CMD ["/bin/sh", "/app/scripts/wait-for-postgres.sh"]
