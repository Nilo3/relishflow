import { Post, Body, UseInterceptors, Controller, UploadedFile, Get, Query, Patch, Delete } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiOperation, ApiBody, ApiConsumes, ApiTags, ApiBearerAuth, ApiHeader } from '@nestjs/swagger'
import { UserRoles } from '@shared/modules/users/enums/roles.enum'

import { UserId } from 'src/decorators/user-id.decorator'
import { Roles } from 'src/decorators/roles.decorator'

import { RestaurantsService } from './restaurants.service'
import { CreateRestaurantRequestDto } from './dtos/create-restaurant-request.dto'
import { UpdateRestaurantRequestDto } from './dtos/update-restaurant-request.dto'
import { CreateStaffRequestDto } from './dtos/create-staff-request.dto'
import { CreateRestaurantScheduleDto } from './dtos/create-restaurant-schedule.dto'
import { CreateRestaurantTableRequestDto } from './dtos/create-restaurant-table-request.dto'

@ApiTags('Restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  // Métodos de creación
  @Post('create')
  @ApiBearerAuth()
  @Roles(UserRoles.SuperAdmin, UserRoles.Tenant)
  @ApiHeader({ name: 'x-refresh-token' })
  @ApiHeader({ name: 'x-id-token' })
  @ApiOperation({ summary: 'Crear un restaurante' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateRestaurantRequestDto })
  @UseInterceptors(FileInterceptor('file'))
  async createRestaurant(@UserId() userId: string, @Body() body: CreateRestaurantRequestDto, @UploadedFile() file?: Express.Multer.File) {
    return await this.restaurantsService.createRestaurant(userId, body, file)
  }

  @Post('create-staff')
  @ApiBearerAuth()
  @Roles(UserRoles.SuperAdmin, UserRoles.Tenant)
  @ApiHeader({ name: 'x-refresh-token' })
  @ApiHeader({ name: 'x-id-token' })
  @ApiOperation({ summary: 'Crear un miembro del staff para un restaurante' })
  async createStaff(@UserId() userId: string, @Body() body: CreateStaffRequestDto) {
    return await this.restaurantsService.createStaff(userId, body)
  }

  @Post('create-schedule/:id')
  @ApiBearerAuth()
  @Roles(UserRoles.SuperAdmin, UserRoles.Tenant)
  @ApiHeader({ name: 'x-refresh-token' })
  @ApiHeader({ name: 'x-id-token' })
  @ApiOperation({ summary: 'Crear un horario para un restaurante' })
  async createSchedule(@Query('id') id: string, @Body() body: CreateRestaurantScheduleDto) {
    return await this.restaurantsService.createSchedule(id, body)
  }

  @Post('create-table/:id')
  @ApiBearerAuth()
  @Roles(UserRoles.SuperAdmin, UserRoles.Tenant)
  @ApiHeader({ name: 'x-refresh-token' })
  @ApiHeader({ name: 'x-id-token' })
  @ApiOperation({ summary: 'Crear una mesa para un restaurante' })
  async createRestaurantTable(@Query('id') id: string, @UserId() userId: string, @Body() body: CreateRestaurantTableRequestDto) {
    return await this.restaurantsService.createRestaurantTable(id, userId, body)
  }

  // Métodos de obtención
  @Get('find-all')
  @ApiBearerAuth()
  @Roles(UserRoles.SuperAdmin, UserRoles.Tenant)
  @ApiHeader({ name: 'x-refresh-token' })
  @ApiHeader({ name: 'x-id-token' })
  @ApiOperation({ summary: 'Obtener todos los restaurantes de un usuario' })
  async findAllRestaurants(@UserId() userId: string) {
    return await this.restaurantsService.findAll(userId)
  }

  @Get('find-all-staff/:id')
  @ApiBearerAuth()
  @Roles(UserRoles.SuperAdmin, UserRoles.Tenant)
  @ApiHeader({ name: 'x-refresh-token' })
  @ApiHeader({ name: 'x-id-token' })
  @ApiOperation({ summary: 'Obtener todos los miembros del staff de un restaurante' })
  async findAllStaff(@Query('id') id: string) {
    return await this.restaurantsService.findAllStaff(id)
  }

  @Get('find-all-schedules/:id')
  @ApiBearerAuth()
  @Roles(UserRoles.SuperAdmin, UserRoles.Tenant)
  @ApiHeader({ name: 'x-refresh-token' })
  @ApiHeader({ name: 'x-id-token' })
  @ApiOperation({ summary: 'Obtener todos los horarios de un restaurante' })
  async findAllSchedules(@UserId() userId: string, @Query('id') id: string) {
    return await this.restaurantsService.findAllSchedules(userId, id)
  }

  // Métodos de actualización
  @Patch('update/:id')
  @ApiBearerAuth()
  @Roles(UserRoles.SuperAdmin, UserRoles.Tenant)
  @ApiHeader({ name: 'x-refresh-token' })
  @ApiHeader({ name: 'x-id-token' })
  @ApiOperation({ summary: 'Actualizar un restaurante' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateRestaurantRequestDto })
  @UseInterceptors(FileInterceptor('file'))
  async updateRestaurant(@Query('id') id: string, @Body() body: UpdateRestaurantRequestDto, @UploadedFile() file?: Express.Multer.File) {
    return await this.restaurantsService.update(id, body, file)
  }

  // Métodos de eliminación
  @Delete('delete-restaurant-schedule/:id')
  @ApiBearerAuth()
  @Roles(UserRoles.SuperAdmin, UserRoles.Tenant)
  @ApiHeader({ name: 'x-refresh-token' })
  @ApiHeader({ name: 'x-id-token' })
  @ApiOperation({ summary: 'Eliminar un horario de un restaurante' })
  async deleteRestaurantSchedule(@Query('id') id: string) {
    return await this.restaurantsService.deleteSchedule(id)
  }
}
