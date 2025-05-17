import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../index';
import { prisma } from '../lib/prisma';

// Define o ambiente como teste
process.env.NODE_ENV = 'test';

describe('Autenticação', () => {
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'senha123'
  };

  beforeAll(async () => {
    // Limpa o banco de dados antes dos testes
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it('deve registrar um novo usuário com sucesso', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send(testUser);

    expect(response.status).toBe(201);

    expect(response.body.message).toBe('Usuário registrado com sucesso');
    expect(response.body.user.email).toBe(testUser.email);
  });

  it('deve fazer login com sucesso', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send(testUser);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');

    expect(response.body.user.email).toBe(testUser.email);
    expect(response.body.user.name).toBe(testUser.name);
  });

  it('deve falhar ao fazer login com credenciais inválidas', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: 'senhaerrada'
      });

    expect(response.status).toBe(401);
  });
});
