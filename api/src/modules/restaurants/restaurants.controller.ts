import { Post, Body, UseInterceptors, Controller, UploadedFile } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiOperation, ApiBody, ApiConsumes } from '@nestjs/swagger'

import { UserId } from 'src/decorators/user-id.decorator'

import { RestaurantsService } from './restaurants.service'
import { CreateRestaurantRequestDto } from './dtos/create-restaurant-request.dto'

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post('create')
  @ApiOperation({ summary: 'Crear un restaurante' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Imagen del restaurante'
        }
      }
    }
  })
  @UseInterceptors(FileInterceptor('file'))
  async createRestaurant(@UserId() userId: string, @Body() body: CreateRestaurantRequestDto, @UploadedFile() file: Express.Multer.File) {
    return await this.restaurantsService.createRestaurant(userId, body, file)
  }
}
