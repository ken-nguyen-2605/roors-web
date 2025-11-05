export {}

declare global {
    type Dish = {
        id: number;
        name: string;
        image: string;
        categories?: string[];
        price: number;
        description?: string;
        ingredient?: string;
        rating: number
    }
}