import type { Request, Response } from 'express';

import itemsService from '@free-market-api/api/items/items.service';

export const searchItems = async (req: Request, res: Response) => {
    try {
        if (!req.query.q) {
            res.status(400).json({
                error: 'q is undefined',
                message: `Para realizar la búsqueda, por favor especifique el parámetro 'q' en la query`,
            });
            return;
        }
        const items = await itemsService.searchItems(req.query.q as string);
        res.json(items);
    } catch (error) {
        console.error(`Error searching items by query in items's controller:`, error);
        res.status(500).json({ error: 'search items controller', message: 'Error al obtener datos' });
    }
};

export const getItemById = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) {
            res.status(400).json({
                error: 'id is undefined',
                message: `Por favor especifique el 'id' del item que solicita`,
            });
            return;
        }
        const item = await itemsService.getItemById(req.params.id);
        res.json(item);
    } catch (error) {
        console.error(`Error getting item by id in items's controller:`, error);
        res.status(500).json({ error: 'get item controller', message: 'Error al obtener datos' });
    }
};
