import request from 'supertest';
import express from 'express';

import { searchItems, getItemById } from '@free-market-api/controllers/items.controller'; // Asegúrate de que la ruta sea correcta
import itemsService from '@free-market-api/services/items.service';

const app = express();
app.use(express.json());
app.get('/items/search', searchItems);
app.get('/items/:id', getItemById);

jest.mock('@free-market-api/services/items.service');
jest.mock('@free-market-api/helpers/logger', () => ({
    error: jest.fn(),
}));

describe('Items Controller', () => {
    describe('GET /items/search', () => {
        it('should return 400 if query parameter "q" is not provided', async () => {
            const response = await request(app).get('/items/search');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                error: 'q is undefined',
                message: "Para realizar la búsqueda, por favor especifique el parámetro 'q' en la query",
            });
        });

        it('should return items for a valid query', async () => {
            const mockItems = { author: 'author', categories: ['category'], items: [] };
            (itemsService.searchItems as jest.Mock).mockResolvedValue(mockItems);

            const response = await request(app).get('/items/search?q=laptop');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockItems);
        });

        it('should return 500 if an error occurs', async () => {
            (itemsService.searchItems as jest.Mock).mockRejectedValue(new Error('Service error'));

            const response = await request(app).get('/items/search?q=laptop');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                error: 'search items controller',
                message: 'Error realizar la búsqueda de items',
            });
        });
    });

    describe('GET /items/:id', () => {
        it('should return 400 if parameter "id" is not provided', async () => {
            const response = await request(app).get('/items/');
            expect(response.status).toBe(404);
        });

        it('should return item by id', async () => {
            const mockItem = { id: '1', title: 'Item 1' };
            (itemsService.getItemById as jest.Mock).mockResolvedValue(mockItem);

            const response = await request(app).get('/items/1');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockItem);
        });

        it('should return 500 if an error occurs', async () => {
            (itemsService.getItemById as jest.Mock).mockRejectedValue(new Error('Service error'));

            const response = await request(app).get('/items/1');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                error: 'get item controller',
                message: 'Error al obtener el item requerido',
            });
        });
    });
});
