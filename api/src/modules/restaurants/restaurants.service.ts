import { HttpStatus, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { RestaurantCodes, RestaurantMessages } from '@shared/modules/restaurants/restaurants.contants'
import { RestaurantStatus } from '@shared/modules/restaurants/enums/restaurant.status.enum'

import { S3Service } from '../s3/s3.service'

import { Restaurant } from './entities/restaurant.entity'
import { CreateRestaurantRequestDto } from './dtos/create-restaurant-request.dto'

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
      addressLocation: body.addressLocation,
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
}
