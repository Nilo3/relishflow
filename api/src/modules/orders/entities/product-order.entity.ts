import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Order } from './order.entity'
import { Product } from 'src/modules/products/entities/product.entity'

@Entity('product_orders')
export class ProductOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Order, (order) => order.productOrders)
  order: Order

  @ManyToOne(() => Product, (product) => product.productOrders)
  product: Product

  @Column('varchar')
  individualPrice: number

  @Column('varchar')
  totalPrice: number

  @Column('varchar')
  quantity: number

  @Column('varchar')
  notes: string
}