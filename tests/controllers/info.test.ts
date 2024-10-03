import request from 'supertest';
import express from 'express';

import { getInfo } from '@free-market-api/controllers/info.controller';
import pkg from '@free-market-api/../package.json';

const app = express();

app.get('/', getInfo);

jest.mock('@free-market-api/helpers/logger', () => ({
    error: jest.fn(),
}));

describe('Info controller', () => {
    it('should return package info', async () => {
        const response = await request(app).get('/');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            title: pkg.name,
            version: pkg.version,
            github: pkg.repository.url,
            author: pkg.author.name,
        });
    });
});
