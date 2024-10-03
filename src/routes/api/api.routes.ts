import { Router } from 'express';

import itemsRoutes from '@free-market-api/routes/api/items/items.routes';

const apiRouter = Router();

apiRouter.use('/items', itemsRoutes);

export default apiRouter;
