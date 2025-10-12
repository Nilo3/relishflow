import { RestaurantStatus } from '../enums/restaurant.status.enum'

export interface IFindAllRestaurantsResponse {
    id: string
    name: string
    status: RestaurantStatus
    isOpen: boolean
    address: string
    logoUrl: string
}