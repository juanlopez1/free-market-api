import nock from 'nock';

import itemsService from '@free-market-api/services/items.service';
import mercadoLibreService from '@free-market-api/services/mercadoLibre.service';
import getMostFrequentCategoryId from '@free-market-api/utils/getMostFrequentCategoryId';
import formatProduct from '@free-market-api/utils/formatProduct';
import type { SearchItemsType } from '@free-market-api/types/items.types';
import type {
    FetchCategoryByIdResponse,
    SearchItemsResponse,
    FetchItemByIdResponse,
} from '@free-market-api/types/mercadoLibre.types';

jest.mock('@free-market-api/utils/formatProduct');
jest.mock('@free-market-api/utils/getMostFrequentCategoryId');
jest.mock('@free-market-api/services/mercadoLibre.service');

describe('ItemsService', () => {
    afterEach(() => {
        jest.clearAllMocks();
        nock.cleanAll();
    });

    describe('searchItems', () => {
        it('should search items and return formatted products', async () => {
            const mockSearchItemsResponse = {
                results: [
                    {
                        id: 'MLA123',
                        title: 'Product 1',
                        price: 100.99,
                        condition: 'new',
                        currency_id: 'ARS',
                        shipping: { free_shipping: true },
                        thumbnail: 'image1.jpg',
                    },
                    {
                        id: 'MLA456',
                        title: 'Product 2',
                        price: 200.99,
                        condition: 'used',
                        currency_id: 'ARS',
                        shipping: { free_shipping: false },
                        thumbnail: 'image2.jpg',
                    },
                ],
            } as SearchItemsResponse;
            const mockItemResponse = {
                id: 'MLA123',
                title: 'Product 1',
                category_id: 'MLA999',
                seller_address: { state: { name: 'Buenos Aires' } },
            } as FetchItemByIdResponse;
            const categoryId = 'MLA999';

            (mercadoLibreService.searchItems as jest.Mock).mockResolvedValue(mockSearchItemsResponse);
            (getMostFrequentCategoryId as jest.Mock).mockReturnValue(categoryId);
            (mercadoLibreService.fetchCategoryById as jest.Mock).mockResolvedValue({
                path_from_root: [{ name: 'Electronics' }],
            } as FetchCategoryByIdResponse);
            (mercadoLibreService.fetchItemById as jest.Mock).mockResolvedValue(mockItemResponse);

            const result: SearchItemsType = await itemsService.searchItems('laptop');

            expect(result.author.name).toBe('Juan Manuel');
            expect(result.author.lastname).toBe('López');
            expect(result.items.length).toBe(2);
            expect(result.items[0].id).toBe('MLA123');
            expect(result.categories).toEqual(['Electronics']);
        });

        it('should handle empty categories if no frequent category is found', async () => {
            const mockSearchItemsResponse = {
                results: [
                    {
                        id: 'MLA123',
                        title: 'Product 1',
                        price: 100.99,
                        condition: 'new',
                        currency_id: 'ARS',
                        shipping: { free_shipping: true },
                        thumbnail: 'image1.jpg',
                    },
                ],
            } as SearchItemsResponse;

            (mercadoLibreService.searchItems as jest.Mock).mockResolvedValue(mockSearchItemsResponse);
            (getMostFrequentCategoryId as jest.Mock).mockReturnValue(null);

            const result: SearchItemsType = await itemsService.searchItems('laptop');

            expect(result.categories).toEqual([]);
            expect(mercadoLibreService.fetchCategoryById).not.toHaveBeenCalled();
        });
    });

    describe('getItemById', () => {
        it('should get item by ID and return formatted product', async () => {
            const mockItemResponse = {
                id: 'MLA123',
                title: 'Product 1',
                category_id: 'MLA999',
                seller_address: { state: { name: 'Buenos Aires' } },
            } as FetchItemByIdResponse;
            const mockDescriptionResponse = { plain_text: 'Product description' };
            const mockFormattedProduct = { id: 'MLA123', title: 'Product 1', description: 'Product description' };

            (mercadoLibreService.fetchItemById as jest.Mock).mockResolvedValue(mockItemResponse);
            (mercadoLibreService.fetchItemDescriptionById as jest.Mock).mockResolvedValue(mockDescriptionResponse);
            (mercadoLibreService.fetchCategoryById as jest.Mock).mockResolvedValue({
                path_from_root: [{ name: 'Electronics' }],
            } as FetchCategoryByIdResponse);
            (formatProduct as jest.Mock).mockReturnValue(mockFormattedProduct);

            const result = await itemsService.getItemById('MLA123');

            expect(result.author.name).toBe('Juan Manuel');
            expect(result.author.lastname).toBe('López');
            expect(result.categories).toEqual(['Electronics']);
            expect(result.item).toEqual(mockFormattedProduct);
        });
    });
});
