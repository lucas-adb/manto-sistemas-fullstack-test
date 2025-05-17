import { Request, Response } from 'express';

import { prisma } from '../lib/prisma';

export const createTask = async (req: Request, res: Response) => {
  const { title, description } = req.body;

  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        userId: req.userId,
      },
    });

    return res.status(201).json(task);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ai criar tarefa' });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  const userId = (req as any).userId;

  try {
    const tasks = await prisma.task.findMany({ where: { userId } });
    res.json(tasks);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar tarefas' });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const task = await prisma.task.findFirst({
      where: { id: Number(id), userId },
    });

    if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });

    return res.json(task);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar tarefa' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;
  const userId = req.userId;

  try {
    const task = await prisma.task.update({
      where: { id: Number(id) },
      data: { title, description, completed },
    });

    return res.json(task);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao atualizar tarefa' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    await prisma.task.delete({ where: { id: Number(id), userId } });
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao deletar tarefa' });
  }
};
