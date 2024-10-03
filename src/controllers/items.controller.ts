import type { Request, Response } from 'express';

import logger from '@free-market-api/helpers/logger';
import itemsService from '@free-market-api/services/items.service';

export const searchItems = async (req: Request, res: Response) => {
    try {
        const query = req.query.q;

        if (!query) {
            res.status(400).json({
                error: 'q is undefined',
                message: `Para realizar la búsqueda, por favor especifique el parámetro 'q' en la query`,
            });
            return;
        }
        const items = await itemsService.searchItems(query as string);
        res.status(200).json(items);
    } catch (error) {
        logger.error(`Error searching items by query in items's controller:`, error);
        res.status(500).json({ error: 'search items controller', message: 'Error realizar la búsqueda de items' });
    }
};

export const getItemById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        if (!id) {
            res.status(400).json({
                error: 'id is undefined',
                message: `Por favor especifique el 'id' del item que solicita`,
            });
            return;
        }
        const item = await itemsService.getItemById(id);
        res.status(200).json(item);
    } catch (error) {
        logger.error(`Error getting item by id in items's controller:`, error);
        res.status(500).json({ error: 'get item controller', message: 'Error al obtener el item requerido' });
    }
};
