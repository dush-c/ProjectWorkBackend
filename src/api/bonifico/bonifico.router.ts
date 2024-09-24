import { Router } from 'express';
import {eseguiBonifico} from './bonifico.controller';
import { isAuthenticated } from '../../utils/auth/authenticated-middleware';

const router = Router();

router.use(isAuthenticated);
// Rotta per eseguire un bonifico
router.post('/', eseguiBonifico);

export default router;
