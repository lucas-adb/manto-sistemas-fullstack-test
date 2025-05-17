import { Router, Request, Response, NextFunction } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { createTask, deleteTask, getTaskById, getTasks, updateTask } from '../controllers/task.controller';

const router = Router();


// Para resolver os problemas de tipagem, já que adicionamos o userId no request
function wrapper(fn: (req: Request, res: Response) => void) {
  return function (req: Request, res: Response, next: NextFunction) {
    fn(req, res);
  };
}

// Todas as rotas aqui serão protegidas com JWT
router.use((req: Request, res: Response, next: NextFunction) => {
  authenticateToken(req, res, next);
});

// CRUD:
router.post('/', wrapper(createTask));
router.get('/:id', wrapper(getTaskById));
router.get('/', getTasks);
router.patch('/:id', wrapper(updateTask));
router.delete('/:id', wrapper(deleteTask));

export default router;
