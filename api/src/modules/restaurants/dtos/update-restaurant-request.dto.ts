import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator'
import { IUpdateRestaurantRequestDto } from '@shared/modules/restaurants/interfaces/update-restaurant-request.inteface'
import { RestaurantStatus } from '@shared/modules/restaurants/enums/restaurant.status.enum'

export class UpdateRestaurantRequestDto implements IUpdateRestaurantRequestDto {
  @ApiProperty({
    example: 'Pasta Palace',
    description: 'The name of the restaurant',
    required: false
  })
  @IsString({ message: 'Name must be a string' })
  @IsOptional()
  name?: string

  @ApiProperty({
    example: true,
    description: 'Indicates if the restaurant is open',
    required: false
  })
  @IsBoolean({ message: 'isOpen must be a boolean' })
  @IsOptional()
  isOpen?: boolean

  @ApiProperty({
    example: '123 Pasta St, Food City',
    description: 'The location of the restaurant',
    required: false
  })
  @IsString({ message: 'Address must be a string' })
  @IsOptional()
  address?: string

  @ApiProperty({
    example: RestaurantStatus.ACTIVE,
    description: 'The status of the restaurant',
    required: false,
    enum: RestaurantStatus
  })
  @IsOptional()
  @IsEnum(RestaurantStatus)
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
