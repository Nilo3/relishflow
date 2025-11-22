import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { Restaurant } from 'src/modules/restaurants/entities/restaurant.entity'
import { Menu } from 'src/modules/menus/entities/menu.entity'
import { ProductOrder } from 'src/modules/orders/entities/product-order.entity'

import { ProductStatus } from '../enums/product-status.enum'

import { ProductIngredients } from './product-ingredients.entity'
import { ProductCategory } from './product-category.entity'

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  name: string

  @Column('varchar')
  description: string

  @Column('varchar')
  price: number

  @Column('varchar')
  imageUrl: string

  @Column('enum', { enum: ProductStatus })
  status: ProductStatus

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.products)
  restaurant: Restaurant

  @ManyToOne(() => ProductCategory, (category) => category.products)
  category: ProductCategory

  @ManyToOne(() => Menu, (menu) => menu.products)
  menu: Menu

  @OneToMany(() => ProductIngredients, (productIngredients) => productIngredients.product)
  ingredients: ProductIngredients[]

  @OneToMany(() => ProductOrder, (productOrder) => productOrder.product)
  productOrders: ProductOrder[]
}

