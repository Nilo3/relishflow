import { ICreateProductCategoryRequest } from '@shared/modules/products/interfaces/create-product-category-request.interface'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'

export class CreateProductCategoryRequestDto implements ICreateProductCategoryRequest {
  @ApiProperty({
    example: 'Postres',
    description: 'The name of the category',
    required: true
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string

  @ApiProperty({
    example: '57aaaa95-d3f5-4158-bbdc-80752543c4ed',
    description: 'uuid of the restaurant',
    required: true
  })
  @IsUUID(4, { message: 'restaurantId must be a UUID' })
  @IsNotEmpty({ message: 'UUID is required' })
  restaurantId: string

  @ApiProperty({
    example: 'category icon',
    description: 'The name of the category icon',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  icon?: string
}
