import request from 'supertest';
import app from '../index';
import { describe, it, expect, vi, Mock, afterEach } from 'vitest';
import * as TodoController from './todo.controller';

const V1Route = '/api/v1/todos';
vi.mock('./todo.controller', () => ({
  __esModule: true,
  GetAllTodo: vi.fn(),
  GetTodo: vi.fn(),
  PostNewTodo: vi.fn(),
  UpdateTodo: vi.fn(),
  DeleteTodo: vi.fn(),
}));

describe('Todo Routes with Mocked Controller', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  describe('GET /todos', () => {
    it('should return 200 and a list of todos on success', async () => {
      (TodoController.GetAllTodo as Mock).mockImplementation((req, res) => {
        res.status(200).json([{ id: 1, title: 'Test Todo' }]);
      });

      const response = await request(app).get(`${V1Route}?page=1&limit=10`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ id: 1, title: 'Test Todo' }]);
    });

    it('should return 500 if the controller throws an error', async () => {
      (TodoController.GetAllTodo as Mock).mockImplementation(() => {
        throw new Error('Internal Server Error');
      });

      const response = await request(app).get(`${V1Route}?page=1&limit=10`);
      expect(response.status).toBe(500);
    });
  });

  describe('GET /todos/:id', () => {
    it('should return 200 and the requested todo on success', async () => {
      (TodoController.GetTodo as Mock).mockImplementation((req, res) => {
        res.status(200).json({ id: 1, title: 'Test Todo' });
      });

      const response = await request(app).get(`${V1Route}/1`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: 1, title: 'Test Todo' });
    });

    it('should return 404 if the todo is not found', async () => {
      (TodoController.GetTodo as Mock).mockImplementation((req, res) => {
        res.status(404).send();
      });

      const response = await request(app).get(`${V1Route}/999`);
      expect(response.status).toBe(404);
    });
  });

  describe('POST /todos', () => {
    it('should return 201 and create a new todo on success', async () => {
      (TodoController.PostNewTodo as Mock).mockImplementation((req, res) => {
        res.status(201).json({ id: 1, title: req.body.title });
      });

      const newTodo = { title: 'New Todo' };
      const response = await request(app).post(V1Route).send(newTodo);
      expect(response.status).toBe(201);
      expect(response.body).toEqual({ id: 1, title: 'New Todo' });
    });

    it('should return 400 if the request body is invalid', async () => {
      (TodoController.PostNewTodo as Mock).mockImplementation((req, res) => {
        res.status(400).send();
      });

      const response = await request(app).post(V1Route).send({});
      expect(response.status).toBe(400);
    });
  });

  describe('PATCH /todos/:id', () => {
    it('should return 200 and update the todo on success', async () => {
      (TodoController.UpdateTodo as Mock).mockImplementation((req, res) => {
        res.status(200).json({ id: 1, title: req.body.title, completed: req.body.completed });
      });

      const updatedTodo = { title: 'Updated Todo', completed: true };
      const response = await request(app).patch(`${V1Route}/1`).send(updatedTodo);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: 1, title: 'Updated Todo', completed: true });
    });

    it('should return 404 if the todo is not found', async () => {
      (TodoController.UpdateTodo as Mock).mockImplementation((req, res) => {
        res.status(404).send();
      });

      const updatedTodo = { title: 'Updated Todo', completed: true };
      const response = await request(app).patch(`${V1Route}/999`).send(updatedTodo);
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /todos/:id', () => {
    it('should return 204 and delete the todo on success', async () => {
      (TodoController.DeleteTodo as Mock).mockImplementation((req, res) => {
        res.status(204).send();
      });

      const response = await request(app).delete(`${V1Route}/1`);
      expect(response.status).toBe(204);
    });

    it('should return 404 if the todo is not found', async () => {
      (TodoController.DeleteTodo as Mock).mockImplementation((req, res) => {
        res.status(404).send();
      });

      const response = await request(app).delete(`${V1Route}/999`);
      expect(response.status).toBe(404);
    });
  });
});
