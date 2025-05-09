import request from 'supertest';
import app from '../src/index';
import { describe, it, expect, vi, beforeAll , afterEach } from 'vitest';
const V1Route = '/api/v1/todos';
describe('Todo Routes', () => {
  beforeAll(() => {
    vi.spyOn(app, 'listen').mockImplementation(() => {
      console.log('Mock server running');
      return { close: vi.fn() } as unknown as ReturnType<typeof app.listen>;
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  describe('GET /todos', () => {
    it('should return 200 and a list of todos', async () => {
      const response = await request(app).get(`${V1Route}?page=1&limit=10`);
      console.log(response.body);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 400 if query parameters are invalid', async () => {
      const response = await request(app).get(`${V1Route}?page=invalid&limit=invalid`);
      expect(response.status).toBe(400);
    });
  });

  describe('GET /todos/:id', () => {
    it('should return 200 and the requested todo', async () => {
      const response = await request(app).get(V1Route + '/1');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
    });

    it('should return 404 if the todo is not found', async () => {
      const response = await request(app).get('/todos/999');
      expect(response.status).toBe(404);
    });

    it('should return 400 if the id is invalid', async () => {
      const response = await request(app).get('/todos/invalid');
      expect(response.status).toBe(400);
    });
  });

  describe('POST /todos', () => {
    it('should return 201 and create a new todo', async () => {
      const newTodo = { title: 'New Todo' };
      const response = await request(app).post('/todos').send(newTodo);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title', newTodo.title);
    });

    it('should return 400 if the request body is invalid', async () => {
      const response = await request(app).post('/todos').send({});
      expect(response.status).toBe(400);
    });
  });

  describe('PATCH /todos/:id', () => {
    it('should return 200 and update the todo', async () => {
      const updatedTodo = { title: 'Updated Todo', completed: true };
      const response = await request(app).patch('/todos/1').send(updatedTodo);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('title', updatedTodo.title);
      expect(response.body).toHaveProperty('completed', updatedTodo.completed);
    });

    it('should return 404 if the todo is not found', async () => {
      const updatedTodo = { title: 'Updated Todo', completed: true };
      const response = await request(app).patch('/todos/999').send(updatedTodo);
      expect(response.status).toBe(404);
    });

    it('should return 400 if the id is invalid', async () => {
      const updatedTodo = { title: 'Updated Todo', completed: true };
      const response = await request(app).patch('/todos/invalid').send(updatedTodo);
      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /todos/:id', () => {
    it('should return 204 and delete the todo', async () => {
      const response = await request(app).delete('/todos/1');
      expect(response.status).toBe(204);
    });

    it('should return 404 if the todo is not found', async () => {
      const response = await request(app).delete('/todos/999');
      expect(response.status).toBe(404);
    });

    it('should return 400 if the id is invalid', async () => {
      const response = await request(app).delete('/todos/invalid');
      expect(response.status).toBe(400);
    });
  });
});
