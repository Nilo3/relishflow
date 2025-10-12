import { RestaurantStatus } from '../enums/restaurant.status.enum'

export interface IUpdateRestaurantRequestDto {
  name?: string
  address?: string
  isOpen?: boolean
  status?: RestaurantStatus
}