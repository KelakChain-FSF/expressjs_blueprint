import prisma from '../../config/prisma.js';

export class TodoData {
  page: number;
  limit: number;

  constructor(page: number = 1, limit: number = 10) {
    this.page = page;
    this.limit = limit;
  }

  async allTodo() {
    const skip = (this.page - 1) * this.limit;
    return prisma.todos.findMany({
      skip,
      take: this.limit,
    });
  }
  async getTodo(id: number) {
    return prisma.todos.findUnique({ where: { id } });
  }
}

export class TodoUtils extends TodoData {
  constructor(page: number = 1, limit: number = 10) {
    super(page, limit);
  }

  async newTodo(title: string) {
    return prisma.todos.create({
      data: { title },
    });
  }
  async updateTodo(id: number, title?: string, completed?: boolean) {
    return prisma.todos.update({
      where: { id },
      data: { ...(title && { title }), ...(completed !== undefined && { completed }) },
    });
  }

  async deleteTodo(id: number) {
    return prisma.todos.delete({ where: { id } });
  }
}
