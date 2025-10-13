import { ApiProperty } from '@nestjs/swagger'
import { IsArray, ArrayNotEmpty, IsUUID } from 'class-validator'

export class CreateMenuRequestDto {
  @ApiProperty({ description: 'Restaurant ID that will own the menu', example: 'c7c2f6a0-9e7c-4a8d-9f0b-3a8f8a4d6a1b', format: 'uuid' })
  @IsUUID('4', { message: 'restaurantId must be a valid UUID' })
  restaurantId: string

  @ApiProperty({ description: 'List of product IDs to associate to this menu', isArray: true, type: String, example: ['7acb9b1d-31c0-4b1d-9a1a-2a3b4c5d6e7f'] })
  @IsArray({ message: 'productIds must be an array' })
  @ArrayNotEmpty({ message: 'productIds cannot be empty' })
  @IsUUID('4', { each: true, message: 'each productId must be a valid UUID' })
  productIds: string[]
}
