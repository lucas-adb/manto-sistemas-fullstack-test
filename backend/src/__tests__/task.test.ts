import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../index';
import { prisma } from '../lib/prisma';
import { sign } from 'jsonwebtoken';

// Define o ambiente como teste
process.env.NODE_ENV = 'test';

describe('Tarefas', () => {
  let authToken: string;
  let userId: number;

  beforeAll(async () => {
    // Limpa o banco de dados e cria um usuário de teste
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();

    const user = await prisma.user.create({
      data: {
        email: 'task-test@example.com',
        password: 'senha123',
        name: 'Test User'
      }
    });

    userId = user.id;
    authToken = sign({ userId: user.id }, process.env.JWT_SECRET || 'secret');
  });

  afterAll(async () => {
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it('deve criar uma nova tarefa', async () => {
    const taskData = {
      title: 'Tarefa de teste',
      description: 'Descrição da tarefa de teste'
    };

    const response = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send(taskData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe(taskData.title);
    expect(response.body.description).toBe(taskData.description);
    expect(response.body.userId).toBe(userId);
  });

  it('deve listar todas as tarefas do usuário', async () => {
    const response = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('deve atualizar uma tarefa existente', async () => {
    const taskData = {
      title: 'Tarefa de teste',
      description: 'Descrição da tarefa de teste'
    };

    // Primeiro cria uma tarefa
    const createResponse = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Tarefa para atualizar',
        description: 'Descrição inicial'
      });

    const taskId = createResponse.body.id;
    const updateData = {
      title: 'Tarefa atualizada',
      description: 'Nova descrição'
    };

    const response = await request(app)
      .patch(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe(updateData.title);
    expect(response.body.description).toBe(updateData.description);
  });
});
