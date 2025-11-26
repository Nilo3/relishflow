import { type IUpdateRestaurantRequestDto } from '@shared/modules/restaurants/interfaces/update-restaurant-request.inteface'
import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional } from 'class-validator'

export class UpdateProductCategoryRequestDto implements IUpdateRestaurantRequestDto {
  @ApiProperty({
    example: 'Postres',
    description: 'The name of the category',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name: string

  @ApiProperty({
    example: 'category icon',
    description: 'The name of the category icon',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  icon?: string
}
