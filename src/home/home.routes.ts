import * as express from 'express';
import * as HomeController from './home.controller.js';
const HomeRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Health
 *     description: Welcome To Expressjs App
 */

/**
 * @swagger
 * /:
 *   get:
 *     tags: [Health]
 *     summary: Welcome Message
 *     description: Return Welcome Message.
 *     responses:
 *       200:
 *         description: The requested todo item.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Welcome to ExpressJs Api!'
 */
HomeRoutes.get('/', HomeController.WelcomePage);

/**
 * @swagger
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Application Health
 *     description: Return Applicaion health status.
 *     responses:
 *       200:
 *         description: The requested todo item.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'ok'
 */
HomeRoutes.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default HomeRoutes;
