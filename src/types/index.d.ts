export {}

declare global {
    type Dish = {
        id: number;
        names: string;
        images: string;
        categories?: string[];
        price: number;
        descriptions?: string;
        ingredients?: string;
        rating: number
    }
}