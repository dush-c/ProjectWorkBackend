import { Router } from 'express';
import {eseguiBonifico, eseguiRicarica} from './bonifico.controller';
import { isAuthenticated } from '../../utils/auth/authenticated-middleware';

const router = Router();

router.use(isAuthenticated);
// Rotta per eseguire un bonifico
router.post('/', eseguiBonifico);
router.post('/ricarica', eseguiRicarica);

export default router;
