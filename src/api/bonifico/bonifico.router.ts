import { Router } from 'express';
import BonificoController from './bonifico.controller';

const router = Router();

// Rotta per eseguire un bonifico
router.post('/', BonificoController.eseguiBonifico);

export default router;
