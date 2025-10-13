import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { Restaurant } from 'src/modules/restaurants/entities/restaurant.entity'
import { Product } from 'src/modules/products/entities/product.entity'

import { MenuStatus } from '../enums/menu-status.enum'

@Entity('menus')
export class Menu {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.menus)
  restaurant: Restaurant

  @Column('enum', { enum: MenuStatus, default: MenuStatus.ACTIVE })
  status: MenuStatus

  @OneToMany(() => Product, (product) => product.menu)
  products: Product[]
}
