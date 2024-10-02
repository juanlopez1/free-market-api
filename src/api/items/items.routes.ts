import { Router } from 'express';
import { searchItems, getItemById } from '@free-market-api/api/items/items.controller';

const router = Router();

router.get('/', searchItems);
router.get('/:id', getItemById);

export default router;
