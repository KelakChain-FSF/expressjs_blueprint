import { TodoData } from './todo.utils';
import { describe, expect, test, beforeEach, afterEach, vi, Mock } from 'vitest';
import prismaClient from '../../config/prisma';
import getPaginationInfo from '../../utils/pagination';
import { TodoUtils } from './todo.utils';
vi.mock('../../config/prisma', () => ({
  __esModule: true,
  default: {
    todos: {
      count: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock('../../utils/pagination', () => ({
  __esModule: true,
  default: vi.fn(),
}));

const mockTodos = [{ id: 1, title: 'Test Todo' }];

describe('TodoData - allTodo', () => {
  const todoData = new TodoData();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('should return paginated todos with correct data', async () => {
    (prismaClient.todos.count as Mock).mockResolvedValueOnce(1);
    (prismaClient.todos.findMany as Mock).mockResolvedValueOnce(mockTodos);
    (getPaginationInfo as Mock).mockReturnValueOnce({
      current: 1,
      next: null,
      prev: null,
      total: 1,
    });

    const result = await todoData.allTodo();

    expect(prismaClient.todos.count).toHaveBeenCalledTimes(1);
    expect(prismaClient.todos.findMany).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
    });
    expect(getPaginationInfo).toHaveBeenCalledWith(1, 1, 10);
    expect(result).toEqual({
      data: mockTodos,
      page: {
        current: 1,
        next: null,
        prev: null,
        total: 1,
      },
    });
  });

  test('should handle empty todos list', async () => {
    (prismaClient.todos.count as Mock).mockResolvedValueOnce(0);
    (prismaClient.todos.findMany as Mock).mockResolvedValueOnce([]);
    (getPaginationInfo as Mock).mockReturnValueOnce({
      current: 1,
      next: null,
      prev: null,
      total: 0,
    });

    const result = await todoData.allTodo();

    expect(prismaClient.todos.count).toHaveBeenCalledTimes(1);
    expect(prismaClient.todos.findMany).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
    });
    expect(getPaginationInfo).toHaveBeenCalledWith(0, 1, 10);
    expect(result).toEqual({
      data: [],
      page: {
        current: 1,
        next: null,
        prev: null,
        total: 0,
      },
    });
  });

  test('should handle pagination correctly', async () => {
    const page = 2;
    const limit = 5;
    const todoDataWithPagination = new TodoData(page, limit);

    (prismaClient.todos.count as Mock).mockResolvedValueOnce(15);
    (prismaClient.todos.findMany as Mock).mockResolvedValueOnce(mockTodos);
    (getPaginationInfo as Mock).mockReturnValueOnce({
      current: 2,
      next: 3,
      prev: 1,
      total: 15,
    });

    const result = await todoDataWithPagination.allTodo();

    expect(prismaClient.todos.count).toHaveBeenCalledTimes(1);
    expect(prismaClient.todos.findMany).toHaveBeenCalledWith({
      skip: 5,
      take: 5,
    });
    expect(getPaginationInfo).toHaveBeenCalledWith(15, 2, 5);
    expect(result).toEqual({
      data: mockTodos,
      page: {
        current: 2,
        next: 3,
        prev: 1,
        total: 15,
      },
    });
  });
});

describe('TodoUtils - CRUD operations', () => {
  const todoUtils = new TodoUtils();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('should create a new todo successfully', async () => {
    const newTodo = { id: 1, title: 'New Todo' };
    (prismaClient.todos.create as Mock).mockResolvedValueOnce(newTodo);

    const result = await todoUtils.newTodo('New Todo');

    expect(prismaClient.todos.create).toHaveBeenCalledWith({
      data: { title: 'New Todo' },
    });
    expect(result).toEqual(newTodo);
  });

  test('should throw an error when creating a new todo fails', async () => {
    (prismaClient.todos.create as Mock).mockRejectedValueOnce(new Error('Database error'));

    await expect(todoUtils.newTodo('New Todo')).rejects.toThrow('Database error');
    expect(prismaClient.todos.create).toHaveBeenCalledWith({
      data: { title: 'New Todo' },
    });
  });

  test('should update a todo successfully', async () => {
    const updatedTodo = { id: 1, title: 'Updated Todo', completed: true };
    (prismaClient.todos.update as Mock).mockResolvedValueOnce(updatedTodo);

    const result = await todoUtils.updateTodo(1, 'Updated Todo', true);

    expect(prismaClient.todos.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { title: 'Updated Todo', completed: true },
    });
    expect(result).toEqual(updatedTodo);
  });

  test('should throw an error when updating a todo fails', async () => {
    (prismaClient.todos.update as Mock).mockRejectedValueOnce(new Error('Database error'));

    await expect(todoUtils.updateTodo(1, 'Updated Todo', true)).rejects.toThrow('Database error');
    expect(prismaClient.todos.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { title: 'Updated Todo', completed: true },
    });
  });

  test('should delete a todo successfully', async () => {
    const deletedTodo = { id: 1, title: 'Deleted Todo' };
    (prismaClient.todos.delete as Mock).mockResolvedValueOnce(deletedTodo);

    const result = await todoUtils.deleteTodo(1);

    expect(prismaClient.todos.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(result).toEqual(deletedTodo);
  });

  test('should throw an error when deleting a todo fails', async () => {
    (prismaClient.todos.delete as Mock).mockRejectedValueOnce(new Error('Database error'));

    await expect(todoUtils.deleteTodo(1)).rejects.toThrow('Database error');
    expect(prismaClient.todos.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });
});
