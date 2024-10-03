import nock from 'nock';

import type {
    FetchCategoryByIdResponse,
    FetchItemByIdResponse,
    FetchItemDescriptionByIdResponse,
    SearchItemsResponse,
} from '@free-market-api/services/mercadoLibre.types';
import mercadoLibreApi from '@free-market-api/services/mercadoLibre.api';

describe('MercadoLibreApi', () => {
    const baseURL = process.env.MERCADO_LIBRE_API_URL as string;

    afterEach(() => {
        nock.cleanAll();
    });

    it('fetchCategoryById should return category data when API call is successful', async () => {
        const mockResponse: FetchCategoryByIdResponse = {
            id: 'MLA123',
            name: 'Zapatos',
            path_from_root: [{ id: 'MLA124', name: 'Plantillas' }],
        };
        nock(baseURL).get('/categories/MLA123').reply(200, mockResponse);

        const data = await mercadoLibreApi.fetchCategoryById({ id: 'MLA123' });
        expect(data).toEqual(mockResponse);
    });

    it('fetchCategoryById should throw an error when API call fails', async () => {
        nock(baseURL).get('/categories/MLA123').reply(500);

        await expect(mercadoLibreApi.fetchCategoryById({ id: 'MLA123' })).rejects.toThrow(
            'Error fetching a category by id',
        );
    });

    it('fetchItemById should return item data when API call is successful', async () => {
        const mockResponse: FetchItemByIdResponse = {
            price: 1235.45,
            id: 'MLA123',
            title: 'Robot de juguete',
            currency_id: 'ARS',
            pictures: [{ url: 'www.photo.com' }],
            condition: 'new',
            shipping: { free_shipping: true },
            category_id: 'MLA506',
            seller_address: { state: { name: 'Capital federal' } },
        };
        nock(baseURL).get('/items/MLA456').reply(200, mockResponse);

        const data = await mercadoLibreApi.fetchItemById({ id: 'MLA456' });
        expect(data).toEqual(mockResponse);
    });

    it('fetchItemDescriptionById should return item description when API call is successful', async () => {
        const mockResponse: FetchItemDescriptionByIdResponse = { plain_text: 'Esto es un robot de juguete :D' };
        nock(baseURL).get('/items/MLA456/description').reply(200, mockResponse);

        const data = await mercadoLibreApi.fetchItemDescriptionById({ id: 'MLA456' });
        expect(data).toEqual(mockResponse);
    });

    it('searchItems should return search results when API call is successful', async () => {
        const mockResponse: SearchItemsResponse = {
            results: [
                {
                    id: 'MLA123',
                    title: 'Zapatillas',
                    condition: 'new',
                    thumbnail: 'www.photo.com',
                    currency_id: 'ARS',
                    price: 1252.25,
                    shipping: { free_shipping: false },
                    category_id: 'MLA869',
                },
            ],
        };
        nock(baseURL).get('/sites/MLA/search').query({ q: 'laptop' }).reply(200, mockResponse);

        const data = await mercadoLibreApi.searchItems({ query: 'laptop' });
        expect(data).toEqual(mockResponse);
    });
});
