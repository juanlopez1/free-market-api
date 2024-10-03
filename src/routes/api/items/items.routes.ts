import { Router } from 'express';
import { searchItems, getItemById } from '@free-market-api/controllers/items.controller';

const itemsRouter = Router();

itemsRouter.get('/', searchItems);
itemsRouter.get('/:id', getItemById);

export default itemsRouter;
