import { TodoData } from './todo.utils';
import prismaClient from '../../config/prisma.js';

describe('TodoData', () => {
  let todoData: TodoData;

  beforeEach(() => {
    todoData = new TodoData(1, 10);
  });

  // describe('allTodo', () => {  });
  test('should return paginated todos and pagination info', async () => {
    const mockTodos = [{ id: 1, title: 'Test Todo' }];
    const mockTotalItems = 1;

    (prismaClient.todos.count as jest.Mock).mockResolvedValue(mockTotalItems);
    (prismaClient.todos.findMany as jest.Mock).mockResolvedValue(mockTodos);

    const result = await todoData.allTodo();

    expect(prismaClient.todos.count).toHaveBeenCalled();
    expect(prismaClient.todos.findMany).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
    });
    expect(result).toEqual({
      data: mockTodos,
      page: {
        totalItems: mockTotalItems,
        totalPages: 1,
        currentPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });
  });
});
