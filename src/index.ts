import express from 'express';
import cors from 'cors';
import http from 'http';
import os from 'node:os';
import dns from 'node:dns';
import { ListenOptions } from 'node:net';
import dotenv from 'dotenv';
import { pinoHttp } from 'pino-http';
import logger from './config/logger.js';
import { setupSwagger } from './config/swagger.js';
import HomeRoutes from './home/home.routes.js';
import TodoRoutes from './todo/todo.routes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use(
  pinoHttp({
    logger,
    customSuccessMessage: (req, res) => `HTTP ${req.method} ${req.url} -> ${res.statusCode}`,
  })
);

setupSwagger(app);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api', [HomeRoutes, TodoRoutes]);

const server = http.createServer(app);
const OPTIONS: ListenOptions = {
  port: parseInt(process.env.PORT || '3000'),
};

server.listen(OPTIONS, () => {
  logger.info(`> Local Api Server :  http://localhost:${OPTIONS.port}`);
  dns.lookup(os.hostname(), { family: 4 }, (err, addr) => {
    if (!err) {
      logger.info(`> Network Api Server :  http://${addr}:${OPTIONS.port}`);
    }
  });
});

export default server;
