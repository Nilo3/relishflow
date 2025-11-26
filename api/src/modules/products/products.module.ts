import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { RestaurantsModule } from '../restaurants/restaurants.module'

import { ProductsService } from './products.service'
import { ProductCategory } from './entities/product-category.entity'
import { Product } from './entities/product.entity'
import { Ingredients } from './entities/ingredients.entity'
import { ProductIngredients } from './entities/product-ingredients.entity'
import { ProductsController } from './products.controller'

@Module({
  imports: [TypeOrmModule.forFeature([ProductCategory, Product, Ingredients, ProductIngredients]), RestaurantsModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService]
})
export class ProductsModule {}
