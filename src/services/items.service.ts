import type { AuthorType } from '@free-market-api/types/author.types';
import type { SearchItem } from '@free-market-api/types/mercadoLibre.types';
import type { ItemType, SearchItemsType } from '@free-market-api/types/items.types';
import type { SearchProductType } from '@free-market-api/types/product.types';
import mercadoLibreService from '@free-market-api/services/mercadoLibre.service';
import formatProduct from '@free-market-api/utils/formatProduct';
import getMostFrequentCategoryId from '@free-market-api/utils/getMostFrequentCategoryId';

class ItemsService {
    private author: AuthorType = {
        name: 'Juan Manuel',
        lastname: 'López',
    };

    private getCategories = async (categoryId: string): Promise<string[]> => {
        const response = await mercadoLibreService.fetchCategoryById({ id: categoryId });
        return response.path_from_root.map((path) => path.name);
    };

    private formatSearchProduct = async (item: SearchItem): Promise<SearchProductType> => {
        const itemResponse = await mercadoLibreService.fetchItemById({ id: item.id });
        const amount = Math.floor(item.price);
        return {
            condition: item.condition,
            free_shipping: item.shipping.free_shipping,
            id: item.id,
            picture: item.thumbnail,
            price: {
                amount,
                currency: item.currency_id,
                decimals: Math.floor((item.price - amount) * 100),
            },
            title: item.title,
            seller_state: itemResponse.seller_address.state.name,
        };
    };

    searchItems = async (query: string): Promise<SearchItemsType> => {
        const response = await mercadoLibreService.searchItems({ query });
        const results = response.results.slice(0, 4);
        const items = await Promise.all(results.map((item) => this.formatSearchProduct(item)));
        const categoryId = getMostFrequentCategoryId(results);
        const categories = categoryId ? await this.getCategories(categoryId) : [];
        return { author: this.author, categories, items };
    };

    getItemById = async (id: string): Promise<ItemType> => {
        const itemResponse = await mercadoLibreService.fetchItemById({ id });
        const descriptionResponse = await mercadoLibreService.fetchItemDescriptionById({ id });
        const categories = await this.getCategories(itemResponse.category_id);
        const item = formatProduct(itemResponse, descriptionResponse);
        return { author: this.author, categories, item };
    };
}

const itemsService = new ItemsService();
export default itemsService;
