export type FetchCategoryByIdRequest = {
    id: string;
};

export type FetchCategoryByIdResponse = {
    id: string;
    name: string;
    path_from_root: {
        id: string;
        name: string;
    }[];
};

export type FetchItemByIdRequest = {
    id: string;
};

export type FetchItemByIdResponse = {
    price: number;
    id: string;
    title: string;
    currency_id: string;
    pictures: { url: string }[];
    condition: 'new' | 'used';
    shipping: { free_shipping: boolean };
    category_id: string;
    seller_address: { state: { name: string } };
};

export type FetchItemDescriptionByIdRequest = {
    id: string;
};

export type FetchItemDescriptionByIdResponse = {
    plain_text: string;
};

export type SearchItemsRequest = {
    query: string;
};

export type SearchItems = {
    id: string;
    title: string;
    condition: 'new' | 'used';
    thumbnail: string;
    currency_id: string;
    price: number;
    shipping: { free_shipping: boolean };
    category_id: string;
};

export type SearchItemsResponse = {
    results: SearchItems[];
};
