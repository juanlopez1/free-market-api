import axios from 'axios';

import type {
    FetchCategoryByIdRequest,
    FetchCategoryByIdResponse,
    FetchItemByIdRequest,
    FetchItemByIdResponse,
    FetchItemDescriptionByIdRequest,
    FetchItemDescriptionByIdResponse,
    SearchItemsRequest,
    SearchItemsResponse,
} from './mercadoLibre.types';

const MP_API_URL = 'https://api.mercadolibre.com/';

class MercadoLibreApi {
    fetchCategoryById = async ({ id }: FetchCategoryByIdRequest): Promise<FetchCategoryByIdResponse> => {
        try {
            const response = await axios.get<FetchCategoryByIdResponse>(`${MP_API_URL}categories/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching a category by id from Mercado Libre API:', error);
            throw new Error('Error fetching a category by id');
        }
    };

    fetchItemById = async ({ id }: FetchItemByIdRequest): Promise<FetchItemByIdResponse> => {
        try {
            const response = await axios.get<FetchItemByIdResponse>(`${MP_API_URL}items/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching an item by id from Mercado Libre API:', error);
            throw new Error('Error fetching an item by id');
        }
    };

    fetchItemDescriptionById = async ({
        id,
    }: FetchItemDescriptionByIdRequest): Promise<FetchItemDescriptionByIdResponse> => {
        try {
            const response = await axios.get<FetchItemDescriptionByIdResponse>(`${MP_API_URL}items/${id}/description`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching item's description by id from Mercado Libre API:`, error);
            throw new Error(`Error fetching item's description`);
        }
    };

    searchItems = async ({ query }: SearchItemsRequest): Promise<SearchItemsResponse> => {
        try {
            const response = await axios.get<SearchItemsResponse>(`${MP_API_URL}sites/MLA/search`, {
                params: { q: query },
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error searching items from Mercado Libre API:', error);
            throw new Error('Error searching items');
        }
    };
}

const mercadoLibreApi = new MercadoLibreApi();
export default mercadoLibreApi;
