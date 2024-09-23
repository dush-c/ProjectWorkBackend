import { Router } from 'express';
import {eseguiBonifico} from './bonifico.controller';

const router = Router();

// Rotta per eseguire un bonifico
router.post('/', eseguiBonifico);

export default router;
