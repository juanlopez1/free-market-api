import type { SearchItem } from '@free-market-api/types/mercadoLibre.types';
import itemsService from '@free-market-api/services/items.service';
import mercadoLibreService from '@free-market-api/services/mercadoLibre.service';
import getMostFrequentCategoryId from '@free-market-api/utils/getMostFrequentCategoryId';
import formatProduct from '@free-market-api/utils/formatProduct';

jest.mock('@free-market-api/utils/getMostFrequentCategoryId');
jest.mock('@free-market-api/utils/formatProduct');
jest.mock('@free-market-api/services/mercadoLibre.service');
jest.mock('@free-market-api/helpers/logger', () => ({
    error: jest.fn(),
}));

describe('ItemsService', () => {
    describe('getCategories', () => {
        it('should return the categories path when called with valid id', async () => {
            const mockCategoryResponse = {
                path_from_root: [{ name: 'Zapatos' }, { name: 'Zapatillas' }],
            };
            (mercadoLibreService.fetchCategoryById as jest.Mock).mockResolvedValue(mockCategoryResponse);

            // biome-ignore lint/complexity/useLiteralKeys: <explanation>
            const result = await itemsService['getCategories']('MLA123');
            expect(result).toEqual(['Zapatos', 'Zapatillas']);
        });

        it('should log error and throw when fetching categories fails', async () => {
            const mockError = new Error('Fetch categories failed');
            (mercadoLibreService.fetchCategoryById as jest.Mock).mockRejectedValue(mockError);

            // biome-ignore lint/complexity/useLiteralKeys: <explanation>
            await expect(itemsService['getCategories']('123')).rejects.toThrow('Error getting categories');
        });
    });

    describe('formatSearchProduct', () => {
        const item: SearchItem = {
            id: 'MLA123',
            category_id: 'MLA7878',
            price: 1000,
            condition: 'new',
            shipping: { free_shipping: true },
            thumbnail: 'url',
            currency_id: 'ARS',
            title: 'PC gamer',
        };

        it('should return a formatted search product when called with valid item', async () => {
            const mockItemResponse = {
                price: 1235.45,
                id: 'MLA123',
                title: 'Robot de juguete',
                currency_id: 'ARS',
                pictures: [{ url: 'url' }],
                condition: 'new',
                shipping: { free_shipping: true },
                category_id: 'MLA506',
                seller_address: { state: { name: 'Capital federal' } },
            };
            (mercadoLibreService.fetchItemById as jest.Mock).mockResolvedValue(mockItemResponse);

            const formattedProduct = {
                condition: 'new',
                free_shipping: true,
                id: 'MLA123',
                picture: 'url',
                price: {
                    amount: 1000,
                    currency: 'ARS',
                    decimals: 0,
                },
                title: 'PC gamer',
                seller_state: 'Capital federal',
            };
            // biome-ignore lint/complexity/useLiteralKeys: <explanation>
            const result = await itemsService['formatSearchProduct'](item);
            expect(result).toEqual(formattedProduct);
        });

        it('should log error and throw when format search product fails', async () => {
            const mockError = new Error('Fetch item failed');
            (mercadoLibreService.fetchItemById as jest.Mock).mockRejectedValue(mockError);

            // biome-ignore lint/complexity/useLiteralKeys: <explanation>
            await expect(itemsService['formatSearchProduct'](item)).rejects.toThrow('Error formatting items');
        });
    });

    describe('searchItems', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should return items and categories for a valid query', async () => {
            const mockSearchResponse = {
                results: [
                    {
                        id: 'MLA123',
                        category_id: 'MLA7878',
                        price: 1000,
                        condition: 'new',
                        shipping: { free_shipping: true },
                        thumbnail: 'url',
                        currency_id: 'ARS',
                        title: 'PC gamer',
                    },
                    {
                        id: 'MLA124',
                        category_id: 'MLA7878',
                        price: 500,
                        condition: 'used',
                        shipping: { free_shipping: false },
                        thumbnail: 'url',
                        currency_id: 'ARS',
                        title: 'PC office',
                    },
                ],
            };
            (mercadoLibreService.searchItems as jest.Mock).mockResolvedValue(mockSearchResponse);
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            jest.spyOn(itemsService as any, 'formatSearchProduct').mockResolvedValue({
                id: 'MLA123',
                title: 'PC gamer',
                price: { currency: 'ARS', amount: 1000, decimals: 0 },
                condition: 'new',
                free_shipping: true,
                picture: 'url',
                seller_state: 'Buenos Aires',
            });
            (getMostFrequentCategoryId as jest.Mock).mockReturnValue('MLA7878');
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            jest.spyOn(itemsService as any, 'getCategories').mockResolvedValue(['Computación']);

            const result = await itemsService.searchItems('laptop');
            expect(result.items).toHaveLength(2);
            expect(result.items[0].id).toBe('MLA123');
            expect(result.items[0].title).toBe('PC gamer');
            expect(result.categories).toEqual(['Computación']);
        });

        it('should log error and throw when search fails', async () => {
            const mockError = new Error('Search failed');
            (mercadoLibreService.searchItems as jest.Mock).mockRejectedValue(mockError);

            await expect(itemsService.searchItems('laptop')).rejects.toThrow('Error searching items');
        });
    });

    describe('getItemById', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should return an item by valid id', async () => {
            const mockItemResponse = {
                id: 'MLA123',
                category_id: 'MLA7877',
                price: 1000,
                title: 'Zapatos',
                currency_id: 'ARS',
                pictures: [{ url: 'url' }],
                condition: 'new',
                shipping: { free_shipping: true },
            };
            const mockDescriptionResponse = {
                plain_text: 'Los mejores zapatos',
            };
            const mockFormattedProduct = {
                id: 'MLA123',
                title: 'Zapatos',
                price: {
                    amount: 1000,
                    currency: 'ARS',
                    decimals: 0,
                },
                picture: 'url',
                condition: 'new',
                free_shipping: true,
                sold_quantity: 999,
                description: 'Los mejores zapatos',
            };
            (mercadoLibreService.fetchItemById as jest.Mock).mockResolvedValue(mockItemResponse);
            (mercadoLibreService.fetchItemDescriptionById as jest.Mock).mockResolvedValue(mockDescriptionResponse);
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            jest.spyOn(itemsService as any, 'getCategories').mockResolvedValue(['Calzado']);
            (formatProduct as jest.Mock).mockReturnValue(mockFormattedProduct);

            const result = await itemsService.getItemById('MLA123');
            expect(result.categories).toEqual(['Calzado']);
            expect(result.item.id).toEqual('MLA123');
            expect(result.item.title).toEqual('Zapatos');
            expect(result.item.description).toEqual('Los mejores zapatos');
        });

        it('should log error and throw when getting item by id fails', async () => {
            const mockError = new Error('Item fetch failed');
            (mercadoLibreService.fetchItemById as jest.Mock).mockRejectedValue(mockError);

            await expect(itemsService.getItemById('MLA123')).rejects.toThrow('Error getting item by id');
        });
    });
});
