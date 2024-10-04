import { AxiosError } from 'axios';
import type { Request, Response } from 'express';

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
        if (error instanceof AxiosError) {
            res.status(error.status ?? 500).json({ type: 'x-server-error', message: error.message });
            return;
        }
        res.status(500).json({ type: 'server-error', message: 'Internal server error' });
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
        if (error instanceof AxiosError) {
            res.status(error.status ?? 500).json({ type: 'x-server-error', message: error.message });
            return;
        }
        res.status(500).json({ type: 'server-error', message: 'Internal server error' });
    }
};
