export {}

declare global {
    type Dish = {
        id: number;
        names: string;
        images: string;
        prices?: number;
        descriptions?: string;
        ingredients?: string;
    }
}