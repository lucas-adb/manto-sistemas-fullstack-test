import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { prisma } from '../lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const register = async (req: Request, res: Response) => {
  const { email, name, password } = req.body;

  try {
    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) return res.status(400).json({ error: 'Usuário já existe' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, name, password: hashedPassword },
    });

    return res.status(201).json({
      message: 'Usuário registrado com sucesso',
      user: { id: user.id, username: user.name },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '1d',
    });

    return res.json({ token, user: { id: user.id, name: user.name } });
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno' });
  }
};
