import prismaClient from '../../config/prisma.js';
import getPaginationInfo from '../../utils/pagination.js';

export class TodoData {
  page: number;
  limit: number;

  constructor(page: number = 1, limit: number = 10) {
    this.page = page;
    this.limit = limit;
  }

  async allTodo() {
    const skip = (this.page - 1) * this.limit;
    const totalItems = await prismaClient.todos.count();
    const pagination = getPaginationInfo(totalItems, this.page, this.limit);

    return {
      data: await prismaClient.todos.findMany({
        skip,
        take: this.limit,
      }),
      page: pagination,
    };
  }
  async getTodo(id: number) {
    return prismaClient.todos.findUnique({ where: { id } });
  }
}

export class TodoUtils extends TodoData {
  constructor(page: number = 1, limit: number = 10) {
    super(page, limit);
  }

  async newTodo(title: string) {
    return prismaClient.todos.create({
      data: { title },
    });
  }
  async updateTodo(id: number, title?: string, completed?: boolean) {
    return prismaClient.todos.update({
      where: { id },
      data: { ...(title && { title }), ...(completed !== undefined && { completed }) },
    });
  }

  async deleteTodo(id: number) {
    return prismaClient.todos.delete({ where: { id } });
  }
}
