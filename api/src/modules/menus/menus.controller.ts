import { Body, Controller, Post, Param, Get, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger'
import { UserRoles } from '@shared/modules/users/enums/roles.enum'

import { Roles } from 'src/decorators/roles.decorator'
import { UserId } from 'src/decorators/user-id.decorator'
import { Public } from 'src/decorators/public.decorator'

import { MenusService } from './menus.service'
import { CreateMenuRequestDto } from './dtos/create-menu-request.dto'
import { UpdateMenuRequestDto } from './dtos/update-menu-request.dto'

@ApiTags('Menus')
@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}
  @Post('create')
  @ApiOperation({ summary: 'Crear un menú de un restaurante' })
  @ApiBearerAuth()
  @Roles(UserRoles.SuperAdmin, UserRoles.Tenant)
  @ApiHeader({ name: 'x-refresh-token' })
  @ApiHeader({ name: 'x-id-token' })
  @ApiBody({ type: CreateMenuRequestDto })
  async createMenu(@UserId() userId: string, @Body() body: CreateMenuRequestDto) {
    return await this.menusService.createMenu(userId, body)
  }

  @Post('update/:id')
  @ApiOperation({ summary: 'Actualizar un menú de un restaurante' })
  @ApiBearerAuth()
  @Roles(UserRoles.SuperAdmin, UserRoles.Tenant)
  @ApiHeader({ name: 'x-refresh-token' })
  @ApiHeader({ name: 'x-id-token' })
  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: UpdateMenuRequestDto })
  async updateMenu(@UserId() userId: string, @Body() body: UpdateMenuRequestDto, @Param('id') id: string) {
    return await this.menusService.updateMenu(userId, id, body)
  }

  @Get('for-restaurant')
  @Public()
  @ApiOperation({ summary: 'Obtener el menú activo de un restaurante' })
  @ApiQuery({ name: 'restaurantId', required: true })
  async getMenuForRestaurant(@Query('restaurantId') restaurantId: string) {
    return await this.menusService.findActiveMenuForRestaurant(restaurantId)
  }
}
