import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const swaggerFilePath = path.resolve(__dirname, '../swagger.json');

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API Documentation',
      version: '1.0.0',
      description: 'API documentation for Express TypeScript app',
    },

    servers: [
      {
        url: '/api',
        description: 'Main API',
      },
      {
        url: '/api/v2',
        description: 'API Version 2',
      },
    ],
  },
  apis: ['./src/**/*.ts'], // Path to route files for documentation
};

const swaggerSpec = swaggerJsdoc(options);

// Ensure the `dist` folder exists before writing
const distDir = path.dirname(swaggerFilePath);
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Write `swagger.json` at runtime
fs.writeFileSync(swaggerFilePath, JSON.stringify(swaggerSpec, null, 2));

export function setupSwagger(app: Express) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

export default swaggerSpec;
