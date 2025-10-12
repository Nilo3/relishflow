import { HttpStatus, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { RestaurantCodes, RestaurantMessages } from '@shared/modules/restaurants/restaurants.contants'
import { RestaurantStatus } from '@shared/modules/restaurants/enums/restaurant.status.enum'
import { IFindAllRestaurantsResponse } from '@shared/modules/restaurants/interfaces/find-all-restaurants-response.interface'

import { S3Service } from '../s3/s3.service'

import { Restaurant } from './entities/restaurant.entity'
import { CreateRestaurantRequestDto } from './dtos/create-restaurant-request.dto'
import { UpdateRestaurantRequestDto } from './dtos/update-restaurant-request.dto'

@Injectable()
export class RestaurantsService {
  private readonly logger = new Logger(RestaurantsService.name)

  @InjectRepository(Restaurant)
  private readonly restaurantRepository: Repository<Restaurant>

  constructor(private readonly s3Service: S3Service) {}

  async createRestaurant(userId: string, body: CreateRestaurantRequestDto, file: Express.Multer.File) {
    this.logger.log('Creating restaurant...')

    // Verificar si ya existe un restaurante con el mismo nombre y usuario
    const existingRestaurant = await this.restaurantRepository.findOne({ where: { name: body.name, user: { id: userId } }, relations: ['user'] })

    if (existingRestaurant) {
      return {
        success: false,
        code: RestaurantCodes.RESTAURANT_ALREADY_EXISTS,
        message: RestaurantMessages[RestaurantCodes.RESTAURANT_ALREADY_EXISTS].en,
        httpCode: HttpStatus.CONFLICT,
        data: null
      }
    }

    const restaurant = this.restaurantRepository.create({
      name: body.name,
      address: body.address,
      isOpen: body.isOpen,
      status: body.status ?? RestaurantStatus.PENDING_APPROVAL
    })

    // Primero guardamos para obtener el ID
    await this.restaurantRepository.save(restaurant)

    this.logger.log(`Restaurant created with ID: ${restaurant.id}`)

    // Subimos la imagen solo si se proporcionó un archivo
    const response = await this.s3Service.upload(`restaurants/${restaurant.id}/logo`, file.buffer, file.mimetype)

    if (!response.success || !response.data) {
      this.logger.error('Error uploading logo to S3')

      return {
        success: true, // Éxito parcial
        code: RestaurantCodes.RESTAURANT_CREATED_WITHOUT_LOGO,
        message: RestaurantMessages[RestaurantCodes.RESTAURANT_CREATED_WITHOUT_LOGO].en,
        httpCode: HttpStatus.CREATED, // Mantenemos 201 porque el recurso principal fue creado
        data: restaurant
      }
    }

    // Actualizamos la URL del logo en el restaurante
    restaurant.logoUrl = response.data

    await this.restaurantRepository.save(restaurant)

    this.logger.log('Restaurant logo uploaded and restaurant updated')

    return {
      success: true,
      code: RestaurantCodes.RESTAURANT_CREATED,
      message: RestaurantMessages[RestaurantCodes.RESTAURANT_CREATED].en,
      httpCode: HttpStatus.CREATED,
      data: restaurant
    }
  }

  async findAll(userId: string) {
    this.logger.log(`Finding all restaurants for user: ${userId}`)

    const restaurants = await this.restaurantRepository.find({ where: { user: { id: userId } }, relations: ['user'] })

    if (restaurants.length === 0) {
      return {
        success: true,
        code: RestaurantCodes.RESTAURANTS_FOUND,
        message: RestaurantMessages[RestaurantCodes.RESTAURANTS_FOUND].en,
        httpCode: HttpStatus.NOT_FOUND,
        data: []
      }
    }

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    this.logger.log(`Found ${restaurants.length} restaurants for user: ${userId}`)

    const response: IFindAllRestaurantsResponse[] = restaurants.map((restaurant) => ({
      id: restaurant.id,
      name: restaurant.name,
      status: restaurant.status,
      isOpen: restaurant.isOpen,
      address: restaurant.address,
      logoUrl: restaurant.logoUrl
    }))

    return {
      success: true,
      code: RestaurantCodes.RESTAURANTS_FOUND,
      message: RestaurantMessages[RestaurantCodes.RESTAURANTS_FOUND].en,
      httpCode: HttpStatus.OK,
      data: response
    }
  }

  async update(id: string, body: UpdateRestaurantRequestDto, file?: Express.Multer.File) {
    this.logger.log(`Updating restaurant with ID: ${id}`)

    const restaurant = await this.restaurantRepository.findOne({ where: { id }, relations: ['user'] })

    if (!restaurant) {
      return {
        success: false,
        code: RestaurantCodes.RESTAURANT_NOT_FOUND,
        message: RestaurantMessages[RestaurantCodes.RESTAURANT_NOT_FOUND].en,
        httpCode: HttpStatus.NOT_FOUND,
        data: null
      }
    }

    if (body.name) {
      restaurant.name = body.name
    }

    if (body.address) {
      restaurant.address = body.address
    }

    if (body.isOpen !== undefined) {
      restaurant.isOpen = body.isOpen
    }

    if (body.status) {
      restaurant.status = body.status
    }

    // Subir la nueva imagen si se proporciona
    if (file) {
      const response = await this.s3Service.upload(`restaurants/${restaurant.id}/logo`, file.buffer, file.mimetype)

      if (!response.success || !response.data) {
        this.logger.error('Error uploading logo to S3')

        return {
          success: true, // Éxito parcial
          code: RestaurantCodes.RESTAURANT_UPDATED_WITHOUT_LOGO,
          message: RestaurantMessages[RestaurantCodes.RESTAURANT_UPDATED_WITHOUT_LOGO].en,
          httpCode: HttpStatus.OK,
          data: restaurant
        }
      }

      // Actualizar la URL del logo en el restaurante
      restaurant.logoUrl = response.data
    }

    await this.restaurantRepository.save(restaurant)

    this.logger.log('Restaurant updated')

    return {
      success: true,
      code: RestaurantCodes.RESTAURANT_UPDATED,
      message: RestaurantMessages[RestaurantCodes.RESTAURANT_UPDATED].en,
      httpCode: HttpStatus.OK,
      data: restaurant
    }
  }
}
