import { Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm'

import { Restaurant } from 'src/modules/restaurants/entities/restaurant.entity'

import { Product } from './product.entity'

@Entity('product_categories')
export class ProductCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  name: string

  @Column('varchar')
  icon: string

  @CreateDateColumn({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP'
  })
  createdAt: Date

  @UpdateDateColumn({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP'
  })
  updatedAt: Date

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.categories)
  restaurant: Restaurant

  @OneToMany(() => Product, (product) => product.category)
  products: Product[]
}
