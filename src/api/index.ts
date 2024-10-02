import { Router } from 'express';

import itemsRoutes from '@free-market-api/api/items/items.routes';

const router = Router();

router.use('/items', itemsRoutes);

export default router;
