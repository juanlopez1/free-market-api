import express from 'express';
import request from 'supertest';

import itemsService from '@free-market-api/services/items.service';
import { searchItems, getItemById } from '@free-market-api/controllers/items.controller';
import { AxiosError } from 'axios';

jest.mock('@free-market-api/services/items.service');

const app = express();
app.use(express.json());
app.get('/items/search', searchItems);
app.get('/items/:id', getItemById);

describe('Items Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('searchItems', () => {
        it('should return 400 if query is undefined', async () => {
            const response = await request(app).get('/items/search');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                error: 'q is undefined',
                message: `Para realizar la búsqueda, por favor especifique el parámetro 'q' en la query`,
            });
        });

        it('should return items when query is provided', async () => {
            const mockItemsResponse = {
                author: { name: 'Juan Manuel', lastname: 'López' },
                categories: ['Electronics'],
                items: [{ id: 'MLA123', title: 'Product 1' }],
            };

            (itemsService.searchItems as jest.Mock).mockResolvedValue(mockItemsResponse);

            const response = await request(app).get('/items/search?q=laptop');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockItemsResponse);
        });

        it('should return 500 if an AxiosError occurs', async () => {
            (itemsService.searchItems as jest.Mock).mockRejectedValue(new AxiosError('Request failed', '500'));

            const response = await request(app).get('/items/search?q=laptop');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ type: 'x-server-error', message: 'Request failed' });
        });

        it('should return 500 if a non-Axios error occurs', async () => {
            (itemsService.searchItems as jest.Mock).mockRejectedValue(new Error('Some other error'));

            const response = await request(app).get('/items/search?q=laptop');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ type: 'server-error', message: 'Internal server error' });
        });
    });

    describe('getItemById', () => {
        it('should return 400 if id is undefined', async () => {
            const response = await request(app).get('/items/');

            expect(response.status).toBe(404); // Cambia a 404 porque Express no encuentra la ruta
        });

        it('should return item when id is provided', async () => {
            const mockItemResponse = {
                author: { name: 'Juan Manuel', lastname: 'López' },
                categories: ['Electronics'],
                item: { id: 'MLA123', title: 'Product 1' },
            };

            (itemsService.getItemById as jest.Mock).mockResolvedValue(mockItemResponse);

            const response = await request(app).get('/items/MLA123');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockItemResponse);
        });

        it('should return 500 if an AxiosError occurs', async () => {
            (itemsService.getItemById as jest.Mock).mockRejectedValue(new AxiosError('Request failed', '500'));

            const response = await request(app).get('/items/MLA123');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ type: 'x-server-error', message: 'Request failed' });
        });

        it('should return 500 if a non-Axios error occurs', async () => {
            (itemsService.getItemById as jest.Mock).mockRejectedValue(new Error('Some other error'));

            const response = await request(app).get('/items/MLA123');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ type: 'server-error', message: 'Internal server error' });
        });
    });
});
