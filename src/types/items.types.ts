import type { AuthorType } from '@free-market-api/types/author.types';
import type { SearchProductType, ProductType } from '@free-market-api/types/product.types';

type Item = {
    author: AuthorType;
    categories: string[];
};

export type ItemType = Item & {
    item: ProductType;
};

export type SearchItemsType = Item & {
    items: SearchProductType[];
};
