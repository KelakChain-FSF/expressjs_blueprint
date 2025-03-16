import * as express from 'express';
import * as HomeController from "./home.controller.js"
const HomeRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Welcome Page
 *     description: Welcome To Expressjs App
 */

/**
 * @swagger
 * /:
 *   get:
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

export default HomeRoutes;
