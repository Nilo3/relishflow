import { ApiProperty } from '@nestjs/swagger'
import { type ICreateRestaurantTableRequest } from '@shared/modules/restaurants/interfaces/create-restaurants-table-request.interface'
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateRestaurantTableRequestDto implements ICreateRestaurantTableRequest {
  @ApiProperty({
    example: 'Pasta Palace',
    description: 'The name of the restaurant',
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'tableNumber must be a number' })
  tableNumber?: number

  @ApiProperty({
    example: 4,
    description: 'The seating capacity of the restaurant table',
    required: true
  })
  @IsNumber({}, { message: 'seatingCapacity must be a number' })
  seatingCapacity: number

  @ApiProperty({
    example: true,
    description: 'Indicates if the restaurant table is available',
    required: true
  })
  @IsBoolean({ message: 'isAvailable must be a boolean' })
  isAvailable: boolean

  @ApiProperty({
    example: 'Near the window',
    description: 'The location of the restaurant table',
    required: true
  })
  @IsString({ message: 'location must be a string' })
  location: string
}
