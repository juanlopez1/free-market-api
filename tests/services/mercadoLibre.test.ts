import nock from 'nock';
import mercadoLibreService from '@free-market-api/services/mercadoLibre.service';
import type {
    FetchCategoryByIdRequest,
    FetchCategoryByIdResponse,
    FetchItemByIdRequest,
    FetchItemByIdResponse,
    FetchItemDescriptionByIdRequest,
    FetchItemDescriptionByIdResponse,
    SearchItemsRequest,
    SearchItemsResponse,
} from '@free-market-api/types/mercadoLibre.types';

describe('MercadoLibreService', () => {
    const API_URL = process.env.MERCADO_LIBRE_API_URL as string;

    afterEach(() => {
        nock.cleanAll();
    });

    describe('fetchCategoryById', () => {
        it('should fetch category by ID', async () => {
            const mockResponse = { id: 'MLA1234', name: 'Electronics' } as FetchCategoryByIdResponse;
            const request: FetchCategoryByIdRequest = { id: 'MLA1234' };

            nock(API_URL).get(`/categories/${request.id}`).reply(200, mockResponse);

            const response = await mercadoLibreService.fetchCategoryById(request);

            expect(response).toEqual(mockResponse);
        });

        it('should throw error on 404', async () => {
            const request: FetchCategoryByIdRequest = { id: 'invalid-id' };

            nock(API_URL).get(`/categories/${request.id}`).reply(404);

            await expect(mercadoLibreService.fetchCategoryById(request)).rejects.toThrow(
                'Request failed with status code 404',
            );
        });
    });

    describe('fetchItemById', () => {
        it('should fetch item by ID', async () => {
            const mockResponse = { id: 'MLA5678', title: 'Smartphone' } as FetchItemByIdResponse;
            const request: FetchItemByIdRequest = { id: 'MLA5678' };

            nock(API_URL).get(`/items/${request.id}`).reply(200, mockResponse);

            const response = await mercadoLibreService.fetchItemById(request);

            expect(response).toEqual(mockResponse);
        });
    });

    describe('fetchItemDescriptionById', () => {
        it('should fetch item description by ID', async () => {
            const mockResponse: FetchItemDescriptionByIdResponse = { plain_text: 'Great smartphone' };
            const request: FetchItemDescriptionByIdRequest = { id: 'MLA5678' };

            nock(API_URL).get(`/items/${request.id}/description`).reply(200, mockResponse);

            const response = await mercadoLibreService.fetchItemDescriptionById(request);

            expect(response).toEqual(mockResponse);
        });
    });

    describe('searchItems', () => {
        it('should search items by query', async () => {
            const mockResponse = { results: [{ id: 'MLA123', title: 'Laptop' }] } as SearchItemsResponse;
            const request: SearchItemsRequest = { query: 'laptop' };

            nock(API_URL).get('/sites/MLA/search').query({ q: request.query }).reply(200, mockResponse);

            const response = await mercadoLibreService.searchItems(request);

            expect(response).toEqual(mockResponse);
        });

        it('should throw error on 400', async () => {
            const request: SearchItemsRequest = { query: '' };

            nock(API_URL).get('/sites/MLA/search').query({ q: request.query }).reply(400);

            await expect(mercadoLibreService.searchItems(request)).rejects.toThrow(
                'Request failed with status code 400',
            );
        });
    });
});
