import type { SearchItem } from '@free-market-api/types/mercadoLibre.types';
import getMostFrequentCategoryId from '@free-market-api/utils/getMostFrequentCategoryId';

describe('getMostFrequentCategoryId', () => {
    it('should return the most frequent category id', () => {
        const items: SearchItem[] = [
            {
                id: '1',
                title: 'Item 1',
                condition: 'new',
                thumbnail: 'url1',
                currency_id: 'USD',
                price: 100,
                shipping: { free_shipping: true },
                category_id: 'A',
            },
            {
                id: '2',
                title: 'Item 2',
                condition: 'used',
                thumbnail: 'url2',
                currency_id: 'USD',
                price: 200,
                shipping: { free_shipping: false },
                category_id: 'B',
            },
            {
                id: '3',
                title: 'Item 3',
                condition: 'new',
                thumbnail: 'url3',
                currency_id: 'USD',
                price: 150,
                shipping: { free_shipping: true },
                category_id: 'A',
            },
            {
                id: '4',
                title: 'Item 4',
                condition: 'used',
                thumbnail: 'url4',
                currency_id: 'USD',
                price: 250,
                shipping: { free_shipping: true },
                category_id: 'C',
            },
        ];

        const result = getMostFrequentCategoryId(items);
        expect(result).toBe('A');
    });

    it('should return undefined for an empty array', () => {
        const result = getMostFrequentCategoryId([]);
        expect(result).toBeUndefined();
    });

    it('should return the category id with the highest frequency when tied', () => {
        const items: SearchItem[] = [
            {
                id: '1',
                title: 'Item 1',
                condition: 'new',
                thumbnail: 'url1',
                currency_id: 'USD',
                price: 100,
                shipping: { free_shipping: true },
                category_id: 'A',
            },
            {
                id: '2',
                title: 'Item 2',
                condition: 'used',
                thumbnail: 'url2',
                currency_id: 'USD',
                price: 200,
                shipping: { free_shipping: false },
                category_id: 'B',
            },
            {
                id: '3',
                title: 'Item 3',
                condition: 'new',
                thumbnail: 'url3',
                currency_id: 'USD',
                price: 150,
                shipping: { free_shipping: true },
                category_id: 'A',
            },
            {
                id: '4',
                title: 'Item 4',
                condition: 'used',
                thumbnail: 'url4',
                currency_id: 'USD',
                price: 250,
                shipping: { free_shipping: true },
                category_id: 'B',
            },
        ];

        const result = getMostFrequentCategoryId(items);
        expect(result).toBe('A');
    });
});
