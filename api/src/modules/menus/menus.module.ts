import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Restaurant } from 'src/modules/restaurants/entities/restaurant.entity'
import { Product } from 'src/modules/products/entities/product.entity'

import { Menu } from './entities/menu.entity'
import { MenusService } from './menus.service'
import { MenusController } from './menus.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Menu, Restaurant, Product])],
  controllers: [MenusController],
  providers: [MenusService],
  exports: [MenusService]
})
export class MenusModule {}
