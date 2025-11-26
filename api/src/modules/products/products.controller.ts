import { Post, Body, Controller, Delete, Query, Patch } from '@nestjs/common'
import { ApiOperation, ApiTags, ApiBearerAuth, ApiHeader } from '@nestjs/swagger'
import { UserRoles } from '@shared/modules/users/enums/roles.enum'

import { UserId } from 'src/decorators/user-id.decorator'
import { Roles } from 'src/decorators/roles.decorator'

import { ProductsService } from './products.service'
import { CreateProductCategoryRequestDto } from './dtos/create-product-category-request.dto'
import { UpdateProductCategoryRequestDto } from './dtos/update-product-category-request.dto'

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Métodos de creación
  @Post('create-category')
  @ApiBearerAuth()
  @Roles(UserRoles.SuperAdmin, UserRoles.Tenant)
  @ApiHeader({ name: 'x-refresh-token' })
  @ApiHeader({ name: 'x-id-token' })
  @ApiOperation({ summary: 'Crear una categoria' })
  async createCategory(@UserId() userId: string, @Body() body: CreateProductCategoryRequestDto) {
    return await this.productsService.createProductCategory(userId, body)
  }

  // Métodos de actualización
  @Patch('update-category/:id')
  @ApiBearerAuth()
  @Roles(UserRoles.SuperAdmin, UserRoles.Tenant)
  @ApiHeader({ name: 'x-refresh-token' })
  @ApiHeader({ name: 'x-id-token' })
  @ApiOperation({ summary: 'Actualizar una categoria' })
  async updateCategory(@Query('id') id: string, @Body() body: UpdateProductCategoryRequestDto) {
    return await this.productsService.updateProductCategory(id, body)
  }

  // Métodos de eliminación
  @Delete('category/:id/:restaurantId')
  @ApiBearerAuth()
  @Roles(UserRoles.SuperAdmin, UserRoles.Tenant)
  @ApiHeader({ name: 'x-refresh-token' })
  @ApiHeader({ name: 'x-id-token' })
  @ApiOperation({ summary: 'Eliminar una categoria' })
  async deleteCategory(@UserId() userId: string, @Query('id') id: string, @Query('restaurantId') restaurantId: string) {
    return await this.productsService.deleteProductCategory(userId, id, restaurantId)
  }
}
