import { Router } from 'express';
import {getMovimenti, getMovimentiPerCategoria, getMovimentiTraDate} from './movimenti.controller';

const router = Router();

// Rotta per ottenere movimenti per conto corrente
router.get('/:contoCorrenteID', getMovimenti);

// Rotta per ottenere movimenti per categoria
router.get('/categoriaMovimento/:contoCorrenteID/:categoriaID', getMovimentiPerCategoria);

// Rotta per ottenere movimenti tra date
router.get('/movimentiTraDate/:contoCorrenteID', getMovimentiTraDate);

export default router;
