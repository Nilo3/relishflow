import { RestaurantTable } from 'src/modules/restaurants/entities/restaurant-tables.entity'
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ProductOrder } from './product-order.entity'
import { Bill } from './bill.entity'
import { OrderStatus } from '../enums/order-status.enum'

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => RestaurantTable, (table) => table.orders)
  table: RestaurantTable

  @ManyToOne(() => Bill, (bill) => bill.orders)
  bill: Bill

  @Column('enum', { enum: OrderStatus })
  status: OrderStatus

  @Column('varchar')
  totalAmount: number
  
  @OneToMany(() => ProductOrder, (productOrder) => productOrder.order)
  productOrders: ProductOrder[]
}
