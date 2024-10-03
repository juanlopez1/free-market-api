import type {
    FetchItemByIdResponse,
    FetchItemDescriptionByIdResponse,
} from '@free-market-api/types/mercadoLibre.types';
import formatProduct from '@free-market-api/utils/formatProduct';

describe('formatProduct', () => {
    it('should format the product correctly', () => {
        const mockItem: FetchItemByIdResponse = {
            price: 999.99,
            id: 'MLA12345',
            title: 'Gaming laptop',
            currency_id: 'ARS',
            pictures: [{ url: 'url' }],
            condition: 'new',
            shipping: { free_shipping: true },
            category_id: 'MLA6789',
            seller_address: { state: { name: 'Capital Federal' } },
        };
        const mockDescription: FetchItemDescriptionByIdResponse = {
            plain_text: 'Una tablet gamer',
        };
        const expectedProduct = {
            id: 'MLA12345',
            title: 'Gaming laptop',
            price: {
                currency: 'ARS',
                amount: 999,
                decimals: 99,
            },
            picture: 'url',
            condition: 'new',
            free_shipping: true,
            sold_quantity: 999,
            description: 'Una tablet gamer',
        };

        const formattedProduct = formatProduct(mockItem, mockDescription);
        expect(formattedProduct).toEqual(expectedProduct);
    });

    it('should handle prices without decimals', () => {
        const mockItem: FetchItemByIdResponse = {
            price: 1000,
            id: 'MLA12345',
            title: 'Laptop',
            currency_id: 'ARS',
            pictures: [{ url: 'url' }],
            condition: 'used',
            shipping: { free_shipping: false },
            category_id: 'MLA6789',
            seller_address: { state: { name: 'Capital Federal' } },
        };
        const mockDescription: FetchItemDescriptionByIdResponse = {
            plain_text: 'Una laptop mas',
        };
        const expectedProduct = {
            id: 'MLA12345',
            title: 'Laptop',
            price: {
                currency: 'ARS',
                amount: 1000,
                decimals: 0,
            },
            picture: 'url',
            condition: 'used',
            free_shipping: false,
            sold_quantity: 999,
            description: 'Una laptop mas',
        };

        const formattedProduct = formatProduct(mockItem, mockDescription);
        expect(formattedProduct).toEqual(expectedProduct);
    });

    it('should handle an empty list of pictures', () => {
        const mockItem: FetchItemByIdResponse = {
            price: 500.5,
            id: 'MLA54321',
            title: 'Tablet',
            currency_id: 'ARS',
            pictures: [],
            condition: 'new',
            shipping: { free_shipping: true },
            category_id: 'MLA6789',
            seller_address: { state: { name: 'Buenos Aires' } },
        };
        const mockDescription: FetchItemDescriptionByIdResponse = {
            plain_text: 'Una tablet mas',
        };
        const expectedProduct = {
            id: 'MLA54321',
            title: 'Tablet',
            price: {
                currency: 'ARS',
                amount: 500,
                decimals: 50,
            },
            picture: undefined,
            condition: 'new',
            free_shipping: true,
            sold_quantity: 999,
            description: 'Una tablet mas',
        };

        const formattedProduct = formatProduct(mockItem, mockDescription);
        expect(formattedProduct).toEqual(expectedProduct);
    });
});
