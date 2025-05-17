import { Router, Request, Response } from 'express';
import { login, register } from '../controllers/auth.controller';

const router = Router();

router.post('/register', function(req: Request, res: Response) {
  register(req, res);
});

router.post('/login', function(req: Request, res: Response) {
  login(req, res);
});

export default router;
