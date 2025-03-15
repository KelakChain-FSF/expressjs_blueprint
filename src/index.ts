import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pinoHttp } from 'pino-http';
import logger from './config/logger.js';
import { setupSwagger } from './config/swagger.js';

dotenv.config();

const app = express();
app.use(pinoHttp({ logger }));
setupSwagger(app);

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
