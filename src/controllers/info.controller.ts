import type { Request, Response } from 'express';

import logger from '@free-market-api/helpers/logger';
import pkg from '@free-market-api/../package.json';

export const getInfo = async (_: Request, res: Response) => {
    try {
        res.send({
            title: pkg.name,
            version: pkg.version,
            github: pkg.repository.url,
            author: pkg.author.name,
        });
    } catch (error) {
        logger.error('Error package', error);
        res.status(500).json({ error: 'error package', message: 'Error en el package' });
    }
};
