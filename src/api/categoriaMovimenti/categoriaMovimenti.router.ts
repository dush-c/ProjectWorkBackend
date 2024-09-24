import express from 'express';
import { getAllCategorie, getCategoriaById } from './categoriaMovimenti.controller';
import { isAuthenticated } from '../../utils/auth/authenticated-middleware';

const router = express.Router();

router.use(isAuthenticated);

router.get('/', getAllCategorie);
router.get('/:id', getCategoriaById);

export default router;