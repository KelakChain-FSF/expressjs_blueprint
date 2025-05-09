import { Request, Response } from 'express';
import { TodoUtils } from './common/todo.utils.js';
import logger from '../config/logger.js';

const todoUtils = new TodoUtils(); // Instantiate TodoUtils once for reuse

// Get a single Todo by ID
export const GetTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const todoId = Number(req.params.id);
    if (isNaN(todoId)) {
      res.status(400).json({ error: 'Invalid Todo ID' });
      return;
    }

    const todo = await todoUtils.getTodo(todoId);
    if (!todo) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }
    res.status(200).json(todo);
  } catch (error) {
    logger.error(`Error fetching Todo with ID ${req.params.id}: ${error}`);
    res.status(500).json({ error: 'Failed to fetch todo' });
  }
};

// Get all Todos with pagination
export const GetAllTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    todoUtils.page = Number(req.query.page) || 1;
    todoUtils.limit = Number(req.query.limit) || 10;

    const todos = await todoUtils.allTodo();
    res.status(200).json(todos);
  } catch (error) {
    logger.error(`Error fetching Todos: ${error}`);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
};

// Create a new Todo
export const PostNewTodo = async (req: Request, res: Response): Promise<void> => {
  const { title } = req.body;
  if (!title) {
    res.status(400).json({ error: 'Title is required' });
    return;
  }

  try {
    const newTodo = await todoUtils.newTodo(title);
    res.status(201).json(newTodo);
  } catch (error) {
    logger.error(`Error creating new Todo: ${error}`);
    res.status(500).json({ error: 'Failed to create todo' });
  }
};

// Update an existing Todo by ID
export const UpdateTodo = async (req: Request, res: Response): Promise<void> => {
  const { title, completed } = req.body;
  const todoId = Number(req.params.id);

  if (isNaN(todoId)) {
    res.status(400).json({ error: 'Invalid Todo ID' });
    return;
  }

  try {
    const updatedTodo = await todoUtils.updateTodo(todoId, title, completed);
    res.status(200).json(updatedTodo);
  } catch (error) {
    logger.error(`Error updating Todo with ID ${req.params.id}: ${error}`);
    res.status(400).json({ error: 'Failed to update todo' });
  }
};

// Delete a Todo by ID
export const DeleteTodo = async (req: Request, res: Response): Promise<void> => {
  const todoId = Number(req.params.id);

  if (isNaN(todoId)) {
    res.status(400).json({ error: 'Invalid Todo ID' });
    return;
  }

  try {
    await todoUtils.deleteTodo(todoId);
    res.status(204).send();
  } catch (error) {
    logger.error(`Error deleting Todo with ID ${req.params.id}: ${error}`);
    res.status(400).json({ error: 'Failed to delete todo' });
  }
};
