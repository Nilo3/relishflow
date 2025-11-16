export interface IUpsertRestaurantsTableResponse {
  id: string
  tableNumber: number
  seatingCapacity: number
  isAvailable: boolean
  location: string
  qrCode: string
}