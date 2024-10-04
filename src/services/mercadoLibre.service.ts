import axios, { type AxiosResponse } from 'axios';
import type {
    FetchCategoryByIdRequest,
    FetchCategoryByIdResponse,
    FetchItemByIdRequest,
    FetchItemByIdResponse,
    FetchItemDescriptionByIdRequest,
    FetchItemDescriptionByIdResponse,
    SearchItemsRequest,
    SearchItemsResponse,
} from '@free-market-api/types/mercadoLibre.types';

class MercadoLibreService {
    processDefaultErrors = <T>(response: AxiosResponse<T>) => {
        if (response.status >= 200 && response.status < 300) {
            return;
        }
        if (response.status === 400) {
            throw new Error(`Bad request: ${response.status} `);
        }
        if (response.status === 404) {
            throw new Error(`Not found: ${response.status} `);
        }
        if (response.status >= 500) {
            throw new Error(`Server error: ${response.status} `);
        }
        throw new Error(`Failed to proceed: ${response.status}`);
    };

    fetchCategoryById = async ({ id }: FetchCategoryByIdRequest): Promise<FetchCategoryByIdResponse> => {
        const response = await axios.get<FetchCategoryByIdResponse>(
            `${process.env.MERCADO_LIBRE_API_URL}categories/${id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );
        this.processDefaultErrors(response);
        return response.data;
    };

    fetchItemById = async ({ id }: FetchItemByIdRequest): Promise<FetchItemByIdResponse> => {
        const response = await axios.get<FetchItemByIdResponse>(`${process.env.MERCADO_LIBRE_API_URL}items/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        this.processDefaultErrors(response);
        return response.data;
    };

    fetchItemDescriptionById = async ({
        id,
    }: FetchItemDescriptionByIdRequest): Promise<FetchItemDescriptionByIdResponse> => {
        const response = await axios.get<FetchItemDescriptionByIdResponse>(
            `${process.env.MERCADO_LIBRE_API_URL}items/${id}/description`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );
        this.processDefaultErrors(response);
        return response.data;
    };

    searchItems = async ({ query }: SearchItemsRequest): Promise<SearchItemsResponse> => {
        const response = await axios.get<SearchItemsResponse>(`${process.env.MERCADO_LIBRE_API_URL}sites/MLA/search`, {
            params: { q: query },
            headers: {
                'Content-Type': 'application/json',
            },
        });
        this.processDefaultErrors(response);
        return response.data;
    };
}

const mercadoLibreService = new MercadoLibreService();
export default mercadoLibreService;
