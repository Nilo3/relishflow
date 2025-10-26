import { HttpStatus, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { RestaurantCodes, RestaurantMessages } from '@shared/modules/restaurants/restaurants.contants'
import { RestaurantStatus } from '@shared/modules/restaurants/enums/restaurant.status.enum'
import { IFindAllRestaurantsResponse } from '@shared/modules/restaurants/interfaces/find-all-restaurants-response.interface'
import { IFindAllStaffResponse } from '@shared/modules/restaurants/interfaces/find-all-staff-response.interface'

import { User } from 'src/modules/users/entities/user.entity'

import { S3Service } from '../s3/s3.service'
import { CognitoService } from '../cognito/cognito.service'

import { Restaurant } from './entities/restaurant.entity'
import { CreateRestaurantRequestDto } from './dtos/create-restaurant-request.dto'
import { UpdateRestaurantRequestDto } from './dtos/update-restaurant-request.dto'
import { RestaurantStaffMember } from './entities/restaurant-staff-members.entity'
import { CreateStaffRequestDto } from './dtos/create-staff-request.dto'
import { RestaurantSchedule } from './entities/restaurant-schedule.entity'
import { CreateRestaurantScheduleDto } from './dtos/create-restaurant-schedule.dto'
import { ScheduleHelpers } from './helpers/schedule.helpers'

@Injectable()
export class RestaurantsService {
  private readonly logger = new Logger(RestaurantsService.name)

  @InjectRepository(Restaurant)
  private readonly restaurantRepository: Repository<Restaurant>
  @InjectRepository(RestaurantStaffMember)
  private readonly staffRepository: Repository<RestaurantStaffMember>
  @InjectRepository(RestaurantSchedule)
  private readonly restaurantScheduleRepository: Repository<RestaurantSchedule>

  constructor(
    private readonly s3Service: S3Service,
    private readonly cognitoService: CognitoService
  ) {}

  // Métodos para el restaurante
  async createRestaurant(userId: string, body: CreateRestaurantRequestDto, file?: Express.Multer.File) {
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
      status: body.status ?? RestaurantStatus.PENDING_APPROVAL,
      user: { id: userId } as User
    })

    // Primero guardamos para obtener el ID
    await this.restaurantRepository.save(restaurant)

    this.logger.log(`Restaurant created with ID: ${restaurant.id}`)

    // Subimos la imagen solo si se proporcionó un archivo
    if (file) {
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
    }

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

  // Métodos para el personal
  async createStaff(userId: string, body: CreateStaffRequestDto) {
    this.logger.log(`Creating staff for restaurant: ${userId}`)

    // First, check if staff already exists in our database by email and restaurant
    const existingStaff = await this.staffRepository.findOne({ where: { email: body.email, restaurant: { id: body.restaurantId } }, relations: ['restaurant'] })

    const restaurant = await this.restaurantRepository.findOne({ where: { id: body.restaurantId, user: { id: userId } }, relations: ['user'] })

    if (!restaurant) {
      return {
        success: false,
        code: RestaurantCodes.RESTAURANT_NOT_FOUND,
        message: RestaurantMessages[RestaurantCodes.RESTAURANT_NOT_FOUND].en,
        httpCode: HttpStatus.NOT_FOUND,
        data: null
      }
    }

    if (existingStaff) {
      this.logger.warn(`Staff with email ${body.email} already exists in database`)

      return {
        success: false,
        code: RestaurantCodes.STAFF_ALREADY_EXISTS,
        message: RestaurantMessages[RestaurantCodes.STAFF_ALREADY_EXISTS].en,
        httpCode: HttpStatus.CONFLICT,
        data: null
      }
    }

    // Crear usuario en Cognito primero
    const cognitoResult = await this.cognitoService.createStaffUser({
      email: body.email,
      password: body.password,
      firstNames: body.name,
      lastNames: body.lastName
    })

    if (!cognitoResult.success || !cognitoResult.data) {
      this.logger.error(`Error creating user in Cognito: ${cognitoResult.message}`)

      // Rollback in Cognito to avoid orphaned accounts
      try {
        await this.cognitoService.deleteUser(body.email)
      } catch (rollbackError) {
        this.logger.error('Failed to rollback Cognito user after DB failure', rollbackError as unknown)
      }

      return {
        success: false,
        code: RestaurantCodes.ERROR_CREATING_STAFF,
        message: cognitoResult.message || 'Error creating user in Cognito',
        httpCode: HttpStatus.BAD_REQUEST,
        data: null
      }
    }

    const staffMember = this.staffRepository.create({
      cognitoId: cognitoResult.data.cognitoId,
      email: body.email,
      name: body.name,
      lastName: body.lastName,
      role: body.role,
      isActive: body.isActive,
      restaurant
    })

    await this.staffRepository.save(staffMember)

    this.logger.log('Staff member created')

    return {
      success: true,
      code: RestaurantCodes.STAFF_CREATED,
      message: RestaurantMessages[RestaurantCodes.STAFF_CREATED].en,
      httpCode: HttpStatus.CREATED,
      data: staffMember
    }
  }

  async findAllStaff(id: string) {
    this.logger.log(`Finding all staff for restaurant: ${id}`)

    const staffMembers = await this.staffRepository.find({ where: { restaurant: { id } }, relations: ['restaurant'] })

    if (staffMembers.length === 0) {
      return {
        success: false,
        code: RestaurantCodes.STAFFS_NOT_FOUND,
        message: RestaurantMessages[RestaurantCodes.STAFFS_NOT_FOUND].en,
        httpCode: HttpStatus.NOT_FOUND,
        data: []
      }
    }

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    this.logger.log(`Found ${staffMembers.length} staff members for restaurant: ${id}`)

    const response: IFindAllStaffResponse[] = staffMembers.map((staff) => ({
      id: staff.id,
      name: staff.name,
      lastName: staff.lastName,
      email: staff.email,
      role: staff.role,
      isActive: staff.isActive
    }))

    return {
      success: true,
      code: RestaurantCodes.STAFFS_FOUND,
      message: RestaurantMessages[RestaurantCodes.STAFFS_FOUND].en,
      httpCode: HttpStatus.OK,
      data: response
    }
  }

  async findStaffByIdCognito(cognitoId: string) {
    const staff = await this.staffRepository.findOne({ where: { cognitoId } })

    return staff
  }

  // Métodos para los horarios
  async createSchedule(restaurantId: string, body: CreateRestaurantScheduleDto) {
    this.logger.log(`Creating schedule for restaurant ${restaurantId}`)

    // Validar el formato de las horas
    if (!ScheduleHelpers.isValidTimeFormat(body.openTime) || !ScheduleHelpers.isValidTimeFormat(body.closeTime)) {
      return {
        success: false,
        code: RestaurantCodes.INVALID_SCHEDULE_FORMAT,
        message: RestaurantMessages[RestaurantCodes.INVALID_SCHEDULE_FORMAT].en,
        httpCode: HttpStatus.BAD_REQUEST,
        data: null
      }
    }

    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
      relations: ['schedules']
    })

    if (!restaurant) {
      return {
        success: false,
        code: RestaurantCodes.RESTAURANT_NOT_FOUND,
        message: RestaurantMessages[RestaurantCodes.RESTAURANT_NOT_FOUND].en,
        httpCode: HttpStatus.NOT_FOUND,
        data: null
      }
    }

    // Verificar si ya existe un horario para ese día
    const existingSchedules = restaurant.schedules.filter((schedule) => schedule.dayOfWeek === body.dayOfWeek)

    // Verificar solapamientos
    const hasOverlap = existingSchedules.some((existingSchedule) =>
      ScheduleHelpers.hasTimeOverlap({ openTime: body.openTime, closeTime: body.closeTime }, { openTime: existingSchedule.openTime, closeTime: existingSchedule.closeTime })
    )

    if (hasOverlap) {
      return {
        success: false,
        code: RestaurantCodes.SCHEDULE_OVERLAP,
        message: RestaurantMessages[RestaurantCodes.SCHEDULE_OVERLAP].en,
        httpCode: HttpStatus.CONFLICT,
        data: null
      }
    }

    // Verificar duplicados exactos
    const hasDuplicate = existingSchedules.some((existingSchedule) =>
      ScheduleHelpers.areSchedulesEqual(
        { dayOfWeek: body.dayOfWeek, openTime: body.openTime, closeTime: body.closeTime },
        { dayOfWeek: existingSchedule.dayOfWeek, openTime: existingSchedule.openTime, closeTime: existingSchedule.closeTime }
      )
    )

    if (hasDuplicate) {
      return {
        success: false,
        code: RestaurantCodes.SCHEDULE_ALREADY_EXISTS,
        message: RestaurantMessages[RestaurantCodes.SCHEDULE_ALREADY_EXISTS].en,
        httpCode: HttpStatus.CONFLICT,
        data: null
      }
    }

    const schedule = this.restaurantScheduleRepository.create({
      restaurant,
      dayOfWeek: body.dayOfWeek,
      openTime: body.openTime,
      closeTime: body.closeTime
    })

    await this.restaurantScheduleRepository.save(schedule)

    return {
      success: true,
      code: RestaurantCodes.SCHEDULE_CREATED,
      message: RestaurantMessages[RestaurantCodes.SCHEDULE_CREATED].en,
      httpCode: HttpStatus.CREATED,
      data: schedule
    }
  }
}
