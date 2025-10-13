import { Repository, In } from 'typeorm'
import { HttpStatus, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ResponseDto } from '@shared/helpers/response.helper'

import { Restaurant } from 'src/modules/restaurants/entities/restaurant.entity'
import { Product } from 'src/modules/products/entities/product.entity'

import { Menu } from './entities/menu.entity'
import { MenuStatus } from './enums/menu-status.enum'
import { CreateMenuRequestDto } from './dtos/create-menu-request.dto'
import { UpdateMenuRequestDto } from './dtos/update-menu-request.dto'

@Injectable()
export class MenusService {
  private readonly logger = new Logger(MenusService.name)

  constructor(
    @InjectRepository(Menu) private readonly menusRepository: Repository<Menu>,
    @InjectRepository(Restaurant) private readonly restaurantsRepository: Repository<Restaurant>,
    @InjectRepository(Product) private readonly productsRepository: Repository<Product>
  ) {}

  async createMenu(userId: string, body: CreateMenuRequestDto): Promise<ResponseDto<Menu>> {
    this.logger.log('Creating menu...')

    const restaurant = await this.restaurantsRepository.findOne({ where: { id: body.restaurantId }, relations: ['user'] })

    if (!restaurant || restaurant.user.id !== userId) {
      return {
        success: false,
        code: 'MENU_RESTAURANT_NOT_OWNED',
        message: 'Restaurant does not exist or is not owned by the user',
        httpCode: HttpStatus.FORBIDDEN,
        data: null
      }
    }

    const products = await this.productsRepository.find({ where: { id: In(body.productIds), restaurant: { id: restaurant.id } }, relations: ['restaurant'] })

    if (products.length !== body.productIds.length) {
      return {
        success: false,
        code: 'MENU_PRODUCTS_NOT_FOUND',
        message: 'Some products were not found for this restaurant',
        httpCode: HttpStatus.BAD_REQUEST,
        data: null
      }
    }

    const menu = this.menusRepository.create({
      restaurant,
      status: MenuStatus.ACTIVE
    })

    await this.menusRepository.save(menu)

    // set owning side on products
    for (const product of products) {
      product.menu = menu
    }
    await this.productsRepository.save(products)

    return {
      success: true,
      code: 'MENU_CREATED',
      message: 'Menu created successfully',
      httpCode: HttpStatus.CREATED,
      data: menu
    }
  }

  async updateMenu(userId: string, id: string, body: UpdateMenuRequestDto): Promise<ResponseDto<Menu>> {
    this.logger.log(`Updating menu for restaurant ${id}...`)

    const menu = await this.menusRepository.findOne({ where: { id }, relations: ['restaurant', 'restaurant.user', 'products'] })

    if (!menu) {
      return {
        success: false,
        code: 'MENU_NOT_FOUND',
        message: 'Menu not found',
        httpCode: HttpStatus.NOT_FOUND,
        data: null
      }
    }

    if (menu.restaurant.user.id !== userId) {
      return {
        success: false,
        code: 'MENU_NOT_OWNED',
        message: 'Menu is not owned by this user',
        httpCode: HttpStatus.FORBIDDEN,
        data: null
      }
    }

    if (body.status) {
      menu.status = body.status
    }

    if (body.productIds) {
      // validate new products belong to same restaurant
      const products = await this.productsRepository.find({ where: { id: In(body.productIds), restaurant: { id: menu.restaurant.id } }, relations: ['restaurant'] })

      if (products.length !== body.productIds.length) {
        return {
          success: false,
          code: 'MENU_PRODUCTS_NOT_FOUND',
          message: 'Some products were not found for this restaurant',
          httpCode: HttpStatus.BAD_REQUEST,
          data: null
        }
      }

      // clear current associations
      if (menu.products.length > 0) {
        for (const p of menu.products) {
          p.menu = null as unknown as Menu // break relation
        }
        await this.productsRepository.save(menu.products)
      }

      for (const product of products) {
        product.menu = menu
      }
      await this.productsRepository.save(products)
      menu.products = products
    }

    await this.menusRepository.save(menu)

    return {
      success: true,
      code: 'MENU_UPDATED',
      message: 'Menu updated successfully',
      httpCode: HttpStatus.OK,
      data: menu
    }
  }

  async findActiveMenuForRestaurant(restaurantId: string): Promise<ResponseDto<Menu>> {
    this.logger.log(`Finding active menu for restaurant ${restaurantId}...`)

    const menu = await this.menusRepository.findOne({ where: { restaurant: { id: restaurantId }, status: MenuStatus.ACTIVE }, relations: ['products', 'restaurant'] })

    if (!menu) {
      return {
        success: true,
        code: 'MENU_NOT_FOUND',
        message: 'No active menu found for this restaurant',
        httpCode: HttpStatus.OK,
        data: null
      }
    }

    return {
      success: true,
      code: 'MENU_FOUND',
      message: 'Active menu found',
      httpCode: HttpStatus.OK,
      data: menu
    }
  }
}
