import type { SearchItem } from '@free-market-api/types/mercadoLibre.types';

const getMostFrequentCategoryId = (items: SearchItem[]): string => {
    const count = items.reduce(
        (acc, item) => {
            const key = item.category_id;
            acc[key] = (acc[key] ?? 0) + 1;
            return acc;
        },
        {} as { [key: string]: number },
    );
    return Object.keys(count).reduce((a, b) => (count[a] > count[b] ? a : b));
};

export default getMostFrequentCategoryId;
