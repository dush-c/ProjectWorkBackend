import { Router } from 'express';
import {getMovimenti, getMovimentiPerCategoria, getMovimentiTraDate} from './movimenti.controller';
import { isAuthenticated } from '../../utils/auth/authenticated-middleware';


const router = Router();

router.use(isAuthenticated);
// Rotta per ottenere movimenti per conto corrente
router.get('/', getMovimenti);

// Rotta per ottenere movimenti per categoria
router.get('/categoriaMovimento/:categoriaID', getMovimentiPerCategoria);

// Rotta per ottenere movimenti tra date
router.get('/movimentiTraDate', getMovimentiTraDate);

export default router;
