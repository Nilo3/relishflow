import { Restaurant } from 'src/modules/restaurants/entities/restaurant.entity'
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { MenuStatus } from '../enums/menu-status.enum'
import { Product } from 'src/modules/products/entities/product.entity'

@Entity('menus')
export class Menu {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.menus)
  restaurant: Restaurant

  @Column('enum', { enum: MenuStatus })
  status: MenuStatus

  @OneToMany(() => Product, (product) => product.menu)
  products: Product[]
}