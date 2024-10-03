import request from 'supertest';

import app from '@free-market-api/app';
import pkg from '@free-market-api/../package.json';

jest.mock('@free-market-api/helpers/logger', () => ({
    error: jest.fn(),
}));

describe('Server', () => {
    it('should return a 200 status code and info body on root endpoint', async () => {
        const mockGetInfo = {
            title: pkg.name,
            version: pkg.version,
            github: pkg.repository.url,
            author: pkg.author.name,
        };
        const response = await request(app).get('/');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockGetInfo);
    });
});
