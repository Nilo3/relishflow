export interface ICreateRestaurantTableRequest {
    tableNumber?: number;
    seatingCapacity: number;
    isAvailable: boolean;
    location: string;
}