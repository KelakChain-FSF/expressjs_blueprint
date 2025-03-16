FROM node:22-alpine

RUN corepack enable

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./

RUN corepack prepare yarn@4.6.0 --activate

RUN mkdir -p /app/node_modules

# Install dependencies with node-modules linker
RUN yarn install --frozen-lockfile

COPY . .

ENV NODE_PATH=/app/node_modules
ENV PATH=$NODE_PATH/.bin:$PATH

# Expose the app's port
EXPOSE 3000

# Run the application in development mode
CMD ["yarn", "dev"]