import { Post, Body, UseInterceptors, Controller, UploadedFile, Get, Query } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiOperation, ApiBody, ApiConsumes, ApiTags, ApiBearerAuth, ApiHeader } from '@nestjs/swagger'
import { UserRoles } from '@shared/modules/users/enums/roles.enum'
import { RestaurantStatus } from '@shared/modules/restaurants/enums/restaurant.status.enum'

import { UserId } from 'src/decorators/user-id.decorator'
import { Roles } from 'src/decorators/roles.decorator'

import { RestaurantsService } from './restaurants.service'
import { CreateRestaurantRequestDto } from './dtos/create-restaurant-request.dto'
import { UpdateRestaurantRequestDto } from './dtos/update-restaurant-request.dto'

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
  async createRestaurant(@UserId() userId: string, @Body() body: CreateRestaurantRequestDto, @UploadedFile() file: Express.Multer.File) {
    return await this.restaurantsService.createRestaurant(userId, body, file)
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

  // Métodos de actualización
  @Post('update/:id')
  @ApiBearerAuth()
  @Roles(UserRoles.SuperAdmin, UserRoles.Tenant)
  @ApiHeader({ name: 'x-refresh-token' })
  @ApiHeader({ name: 'x-id-token' })
  @ApiOperation({ summary: 'Actualizar un restaurante' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Pasta Palace',
          description: 'The name of the restaurant'
        },
        isOpen: {
          type: 'boolean',
          example: true,
          description: 'Indicates if the restaurant is open'
        },
        address: {
          type: 'string',
          example: '123 Pasta St, Food City',
          description: 'The location of the restaurant'
        },
        status: {
          type: 'string',
          enum: Object.values(RestaurantStatus),
          description: 'The status of the restaurant (optional)',
          example: RestaurantStatus.PENDING_APPROVAL
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'Logo image of the restaurant'
        }
      }
    }
  })
  @UseInterceptors(FileInterceptor('file'))
  async updateRestaurant(@Query('id') id: string, @Body() body: UpdateRestaurantRequestDto, @UploadedFile() file?: Express.Multer.File) {
    return await this.restaurantsService.update(id, body, file)
  }

  // Métodos de eliminación
}
