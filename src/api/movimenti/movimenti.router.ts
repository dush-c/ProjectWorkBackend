import { Router } from 'express';
import {getMovimenti, getMovimentiPerCategoria, getMovimentiTraDate, createMovimento, getMovimentiById} from './movimenti.controller';
import { isAuthenticated } from '../../utils/auth/authenticated-middleware';


const router = Router();

router.use(isAuthenticated);
// Rotta per ottenere movimenti per conto corrente
router.get('/', getMovimenti);

// Rotta per ottenere movimenti per categoria
router.get('/categoriaMovimento/:categoriaID', getMovimentiPerCategoria);

// Rotta per ottenere movimenti tra date
router.get('/movimentiTraDate', getMovimentiTraDate);

// Rotta per creare un movimento
router.post('/', createMovimento);

router.get('/:id', getMovimentiById);

export default router;
