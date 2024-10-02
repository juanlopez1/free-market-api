export type SearchProductType = {
    id: string;
    title: string;
    price: {
        currency: string;
        amount: number;
        decimals: number;
    };
    picture: string;
    condition: 'new' | 'used';
    free_shipping: boolean;
    seller_state: string;
};

export type ProductType = Omit<SearchProductType, 'seller_state'> & {
    sold_quantity: number;
    description: string;
};
