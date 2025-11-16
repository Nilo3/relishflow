import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'
import { type IUpdateRestaurantsTableRequest } from '@shared/modules/restaurants/interfaces/update-restaurants-table-request.interface'

export class UpdateRestaurantTableRequestDto implements IUpdateRestaurantsTableRequest {
  @ApiProperty({
    example: 1,
    description: 'The number of the restaurant table',
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'tableNumber must be a number' })
  tableNumber?: number

  @ApiProperty({
    example: 4,
    description: 'The seating capacity of the restaurant table',
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'seatingCapacity must be a number' })
  seatingCapacity?: number

  @ApiProperty({
    example: true,
    description: 'Indicates if the restaurant table is available',
    required: false
  })
  @IsOptional()
  @IsBoolean({ message: 'isAvailable must be a boolean' })
  isAvailable?: boolean

  @ApiProperty({
    example: 'Near the window',
    description: 'The location of the restaurant table',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'location must be a string' })
  location?: string
}
