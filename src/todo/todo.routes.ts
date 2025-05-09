import * as express from 'express';
import * as TodoController from './todo.controller.js';
const TodoRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Todos
 *     description: Todo management
 */

/**
 * @swagger
 * /todos:
 *   get:
 *     tags: [Todos]
 *     summary: Get all todos
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number (default is 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page (default is 10)
 *     responses:
 *       200:
 *         description: A list of todos.
 */
TodoRoutes.get('/todos', TodoController.GetAllTodo);

/**
 * @swagger
 * /todos/{id}:
 *   get:
 *     tags: [Todos]
 *     summary: Get a specific todo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the todo to retrieve
 *     responses:
 *       200:
 *         description: The requested todo item.
 */
TodoRoutes.get('/todos/:id', TodoController.GetTodo);

/**
 * @swagger
 * /todos:
 *   post:
 *     tags: [Todos]
 *     summary: Create a new todo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "New task"
 *     responses:
 *       201:
 *         description: Todo created successfully.
 */
TodoRoutes.post('/todos/', TodoController.PostNewTodo);

/**
 * @swagger
 * /todos/{id}:
 *   patch:
 *     tags: [Todos]
 *     summary: Update a todo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the todo to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated task"
 *               completed:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Todo updated successfully.
 */
TodoRoutes.patch('/todos/:id', TodoController.UpdateTodo);

/**
 * @swagger
 * /todos/{id}:
 *   delete:
 *     tags: [Todos]
 *     summary: Delete a todo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the todo to delete
 *     responses:
 *       204:
 *         description: Todo deleted successfully.
 */
TodoRoutes.delete('/todos/:id', TodoController.DeleteTodo);

export default TodoRoutes;
