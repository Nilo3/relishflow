import { RestaurantTable } from 'src/modules/restaurants/entities/restaurant-tables.entity'
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { BillStatus } from '../enums/bill-status.enum'
import { PaymentMethods } from '../enums/payment-methods.enum'
import { Order } from './order.entity'

@Entity('bills')
export class Bill {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => RestaurantTable, (table) => table.bills)
  table: RestaurantTable

  @Column('enum', { enum: BillStatus })
  status: BillStatus

  @Column('varchar')
  totalAmount: number

  @Column('enum', { enum: PaymentMethods })
  paymentMethod: PaymentMethods

  @OneToMany(() => Order, (order) => order.bill)
  orders: Order[]
}