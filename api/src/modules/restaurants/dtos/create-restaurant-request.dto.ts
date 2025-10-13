import { ICreateRestaurantsRequest } from '@shared/modules/restaurants/interfaces/create-restaurants-request.interface'
import { RestaurantStatus } from '@shared/modules/restaurants/enums/restaurant.status.enum'
import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateRestaurantRequestDto implements ICreateRestaurantsRequest {
  @ApiProperty({
    example: 'Pasta Palace',
    description: 'The name of the restaurant',
    required: true
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string

  @ApiProperty({
    example: true,
    description: 'Indicates if the restaurant is open',
    required: true
  })
  @IsBoolean({ message: 'isOpen must be a boolean' })
  @IsNotEmpty({ message: 'isOpen is required' })
  isOpen: boolean

  @ApiProperty({
    example: '123 Pasta St, Food City',
    description: 'The location of the restaurant',
    required: true
  })
  @IsString({ message: 'Address must be a string' })
  @IsNotEmpty({ message: 'Address is required' })
  address: string

  @ApiProperty({
    example: RestaurantStatus.ACTIVE,
    description: 'The status of the restaurant',
    required: false,
    enum: RestaurantStatus
  })
  @IsEnum(RestaurantStatus)
  @IsOptional()
  status?: RestaurantStatus

  @ApiProperty({
    description: 'Logo image of the restaurant',
    required: false,
    type: 'string',
    format: 'binary'
  })
  @IsOptional()
  file?: unknown
}
