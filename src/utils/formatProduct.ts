import type {
    FetchItemByIdResponse,
    FetchItemDescriptionByIdResponse,
} from '@free-market-api/types/mercadoLibre.types';

const formatProduct = (item: FetchItemByIdResponse, description: FetchItemDescriptionByIdResponse) => {
    const amount = Math.floor(item.price);
    return {
        id: item.id,
        title: item.title,
        price: {
            currency: item.currency_id,
            amount,
            decimals: Math.floor((item.price - amount) * 100),
        },
        picture: item.pictures[0]?.url,
        condition: item.condition,
        free_shipping: item.shipping.free_shipping,
        sold_quantity: 999, // This field is not returning by ML API
        description: description.plain_text,
    };
};

export default formatProduct;
