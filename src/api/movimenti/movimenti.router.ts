import { Router } from 'express';
import MovimentiController from './movimenti.controller';

const router = Router();

// Rotta per ottenere movimenti per conto corrente
router.get('/:contoCorrenteID', MovimentiController.getMovimenti);

// Rotta per ottenere movimenti per categoria
router.get('/categoriaMovimento/:contoCorrenteID/:categoriaID', MovimentiController.getMovimentiPerCategoria);

// Rotta per ottenere movimenti tra date
router.get('/movimentiTraDate/:contoCorrenteID', MovimentiController.getMovimentiTraDate);

export default router;
