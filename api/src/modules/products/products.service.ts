import { HttpStatus, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ProductCodes, ProductMessages } from '@shared/modules/products/products.constants'
import { ICreateProductCategoryResponse } from '@shared/modules/products/interfaces/create-product-category-response.interface'

import { RestaurantsService } from '../restaurants/restaurants.service'

import { CreateProductCategoryRequestDto } from './dtos/create-product-category.request.dto'
import { Product } from './entities/product.entity'
import { ProductCategory } from './entities/product-category.entity'
import { ProductIngredients } from './entities/product-ingredients.entity'

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name)

  @InjectRepository(Product)
  private readonly productRepository: Repository<Product>
  @InjectRepository(ProductCategory)
  private readonly productCategoryRepository: Repository<ProductCategory>
  @InjectRepository(ProductIngredients)
  private readonly productIngredientsRepository: Repository<ProductIngredients>

  constructor(private readonly restaurantService: RestaurantsService) {}

  // Métodos para el Product Category
  async createProductCategory(userId: string, body: CreateProductCategoryRequestDto) {
    const { name, icon, restaurantId } = body

    this.logger.log('Searching restaurant...')

    const restaurantResult = await this.restaurantService.findRestaurantByIdAndUser(restaurantId, userId)

    if (!restaurantResult.success || !restaurantResult.data) {
      return restaurantResult
    }

    const restaurant = restaurantResult.data

    this.logger.log('Creating product category...')

    // Verificar si ya existe una categoria con el mismo nombre en un restaurante
    const existingCategory = await this.productCategoryRepository.findOne({ where: { name: name, restaurant: { id: restaurant.id } }, relations: ['restaurant'] })

    if (existingCategory) {
      return {
        success: false,
        code: ProductCodes.CATEGORY_ALREADY_EXISTS,
        message: ProductMessages[ProductCodes.CATEGORY_ALREADY_EXISTS].en,
        httpCode: HttpStatus.CONFLICT,
        data: null
      }
    }

    const category = this.productCategoryRepository.create({
      name,
      icon,
      restaurant
    })

    // Primero guardamos para obtener el ID
    const savedCategory = await this.productCategoryRepository.save(category)

    this.logger.log(`Category created with ID: ${savedCategory.id}`)

    // Retornamos solo la información necesaria
    const response: ICreateProductCategoryResponse = {
      id: savedCategory.id,
      name: savedCategory.name,
      icon: savedCategory.icon
    }

    return {
      success: true,
      code: ProductCodes.CATEGORY_CREATED,
      message: ProductMessages[ProductCodes.CATEGORY_CREATED].en,
      httpCode: HttpStatus.CREATED,
      data: response
    }
  }

  async deleteProductCategory(userId: string, id: string, restaurantId: string) {
    this.logger.log('Searching restaurant...')

    const restaurantResult = await this.restaurantService.findRestaurantByIdAndUser(restaurantId, userId)

    if (!restaurantResult.success || !restaurantResult.data) {
      return restaurantResult
    }

    const restaurant = restaurantResult.data

    this.logger.log('Deleting product category...')

    // Verificar si ya existe una categoria con el mismo id en un restaurante
    const existingCategory = await this.productCategoryRepository.findOne({ where: { id, restaurant: { id: restaurant.id } }, relations: ['restaurant'] })

    if (!existingCategory) {
      return {
        success: false,
        code: ProductCodes.CATEGORY_NOT_FOUND,
        message: ProductMessages[ProductCodes.CATEGORY_NOT_FOUND].en,
        httpCode: HttpStatus.NOT_FOUND,
        data: null
      }
    }

    await this.productCategoryRepository.remove(existingCategory)

    this.logger.log('Category deleted')

    return {
      success: true,
      code: ProductCodes.CATEGORY_DELETED,
      message: ProductMessages[ProductCodes.CATEGORY_DELETED].en,
      httpCode: HttpStatus.OK,
      data: null
    }
  }
}
