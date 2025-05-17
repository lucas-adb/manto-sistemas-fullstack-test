import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import request from 'supertest';
import { app } from '../index';
import { prisma } from '../lib/prisma';
import { sign } from 'jsonwebtoken';

// Define o ambiente como teste
process.env.NODE_ENV = 'test';

describe('Tarefas', () => {
  let authToken: string;
  let userId: number;

  const originalTaskCreate = prisma.task.create;
  const originalTaskFindMany = prisma.task.findMany;
  const originalTaskFindFirst = prisma.task.findFirst;
  const originalTaskUpdate = prisma.task.update;
  const originalTaskDelete = prisma.task.delete;

  beforeAll(async () => {
    // Limpa o banco de dados e cria um usuário de teste
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();

    const user = await prisma.user.create({
      data: {
        email: 'task-test@example.com',
        password: 'senha123',
        name: 'Test User',
      },
    });

    userId = user.id;
    authToken = sign({ userId: user.id }, process.env.JWT_SECRET || 'secret');
  });

  afterAll(async () => {
    // Restaura todas as implementações originais
    prisma.task.create = originalTaskCreate;
    prisma.task.findMany = originalTaskFindMany;
    prisma.task.findFirst = originalTaskFindFirst;
    prisma.task.update = originalTaskUpdate;
    prisma.task.delete = originalTaskDelete;

    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it('deve criar uma nova tarefa', async () => {
    const taskData = {
      title: 'Tarefa de teste',
      description: 'Descrição da tarefa de teste',
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

  it('deve disparar error ao criar com userId falso', async () => {
    prisma.task.create = vi
      .fn()
      .mockRejectedValueOnce(new Error('Erro simulado'));

    const taskData = {
      title: 'Tarefa com erro',
      description: 'Esta tarefa deve gerar um erro 500',
    };

    const response = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send(taskData);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Erro ai criar tarefa');

    // Restaura a implementação original após o teste
    prisma.task.create = originalTaskCreate;
  });

  it('deve listar todas as tarefas do usuário', async () => {
    const response = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('deve disparar erro ao listar todas as tarefas do usuário com usuário inválido', async () => {
    prisma.task.findMany = vi
      .fn()
      .mockRejectedValueOnce(new Error('Erro simulado'));

    const response = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Erro ao buscar tarefas');
  });

  it('deve buscar uma tarefa específica pelo ID', async () => {
    // Primeiro, criar uma tarefa para depois buscar pelo ID
    const taskData = {
      title: 'Tarefa para buscar',
      description: 'Descrição da tarefa para buscar pelo ID',
    };

    const createResponse = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send(taskData);

    const taskId = createResponse.body.id;

    const response = await request(app)
      .get(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe(taskId);
    expect(response.body.title).toBe(taskData.title);
    expect(response.body.description).toBe(taskData.description);
  });

  it('deve retornar 404 ao buscar uma tarefa que não existe', async () => {
    const nonExistentId = 99999; // ID que não deve existir

    const response = await request(app)
      .get(`/tasks/${nonExistentId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Tarefa não encontrada');
  });

  it('deve disparar erro 500 ao buscar tarefa por ID com erro no banco', async () => {
    prisma.task.findFirst = vi
      .fn()
      .mockRejectedValueOnce(new Error('Erro simulado no findFirst'));

    const response = await request(app)
      .get(`/tasks/1`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Erro ao buscar tarefa');

    // Restaura a implementação original
    prisma.task.findFirst = originalTaskFindFirst;
  });

  it('deve atualizar uma tarefa existente', async () => {
    const taskData = {
      title: 'Tarefa para atualizar',
      description: 'Descrição da tarefa de teste',
    };

    // Primeiro cria uma tarefa
    const createResponse = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send(taskData);

    const taskId = createResponse.body.id;
    const updateData = {
      title: 'Tarefa atualizada',
      description: 'Nova descrição',
    };

    const response = await request(app)
      .patch(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe(updateData.title);
    expect(response.body.description).toBe(updateData.description);
  });

  it('deve disparar erro 500 ao atualizar tarefa com erro no banco', async () => {
    // Primeiro, criar uma tarefa para depois tentar atualizar
    const taskData = {
      title: 'Tarefa para atualizar com erro',
      description: 'Descrição inicial',
    };

    const createResponse = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send(taskData);

    const taskId = createResponse.body.id;
    
    // Mock do prisma.task.update para lançar erro
    prisma.task.update = vi
      .fn()
      .mockRejectedValueOnce(new Error('Erro simulado no update'));

    const updateData = {
      title: 'Tarefa atualizada',
      description: 'Nova descrição',
    };

    const response = await request(app)
      .patch(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateData);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Erro ao atualizar tarefa');

    // Restaura a implementação original
    prisma.task.update = originalTaskUpdate;
  });

  it('deve deletar uma tarefa existente', async () => {
    // Primeiro, criar uma tarefa para depois deletar
    const taskData = {
      title: 'Tarefa para deletar',
      description: 'Descrição da tarefa para deletar',
    };

    const createResponse = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send(taskData);

    const taskId = createResponse.body.id;

    const response = await request(app)
      .delete(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(204);
  });

  it('deve disparar erro 500 ao deletar tarefa com erro no banco', async () => {
    // Primeiro, criar uma tarefa para depois tentar deletar
    const taskData = {
      title: 'Tarefa para deletar com erro',
      description: 'Descrição da tarefa para deletar com erro',
    };

    const createResponse = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send(taskData);

    const taskId = createResponse.body.id;
    
    // Mock do prisma.task.delete para lançar erro
    prisma.task.delete = vi
      .fn()
      .mockRejectedValueOnce(new Error('Erro simulado no delete'));

    const response = await request(app)
      .delete(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Erro ao deletar tarefa');

    // Restaura a implementação original
    prisma.task.delete = originalTaskDelete;
  });
});
