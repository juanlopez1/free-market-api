import { Router } from 'express';

import { getInfo } from '@free-market-api/controllers/info.controller';
import apiRoutes from '@free-market-api/routes/api/api.routes';

const router = Router();

router.get('/', getInfo);
router.use('/api', apiRoutes);

export default router;
