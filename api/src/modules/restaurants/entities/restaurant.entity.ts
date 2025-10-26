import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { RestaurantStatus } from '@shared/modules/restaurants/enums/restaurant.status.enum'

import { User } from 'src/modules/users/entities/user.entity'
import { Menu } from 'src/modules/menus/entities/menu.entity'
import { Product } from 'src/modules/products/entities/product.entity'

import { RestaurantSchedule } from './restaurant-schedule.entity'
import { RestaurantTable } from './restaurant-tables.entity'
import { RestaurantStaffMember } from './restaurant-staff-members.entity'

@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  name: string

  @Column('enum', { enum: RestaurantStatus, default: RestaurantStatus.PENDING_APPROVAL })
  status: RestaurantStatus

  @Column('boolean', { default: false })
  isOpen: boolean

  @Column('varchar')
  address: string

  @Column('varchar', { nullable: true })
  logoUrl: string

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

  @ManyToOne(() => User, (user) => user.restaurants)
  @JoinColumn({ name: 'userId' })
  user: User

  @OneToMany(() => RestaurantSchedule, (schedule) => schedule.restaurant)
  schedules: RestaurantSchedule[]

  @OneToMany(() => RestaurantTable, (table) => table.restaurant)
  tables: RestaurantTable[]

  @OneToMany(() => RestaurantStaffMember, (staffMember) => staffMember.restaurant)
  staffMembers: RestaurantStaffMember[]

  @OneToMany(() => Menu, (menu) => menu.restaurant)
  menus: Menu[]

  @OneToMany(() => Product, (product) => product.restaurant)
  products: Product[]
}
