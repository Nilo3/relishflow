import { RestaurantStatus } from '../enums/restaurant.status.enum'

export interface ICreateRestaurantsRequest {
    name: string
    isOpen: boolean
    location: string
    status?: RestaurantStatus
}