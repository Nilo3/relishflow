import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { Order } from 'src/modules/orders/entities/order.entity'
import { Bill } from 'src/modules/orders/entities/bill.entity'

import { Restaurant } from './restaurant.entity'

@Entity('restaurant_tables')
export class RestaurantTable {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.tables)
  restaurant: Restaurant

  @Column('varchar')
  tableNumber: number

  @Column('varchar')
  qrCode: string

  @Column('varchar')
  seatingCapacity: number

  @Column('varchar')
  isAvailable: boolean

  @Column('varchar')
  location: string

  @OneToMany(() => Order, (order) => order.table)
  orders: Order[]

  @OneToMany(() => Bill, (bill) => bill.table)
  bills: Bill[]
}
