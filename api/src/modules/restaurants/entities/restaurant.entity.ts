import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { RestaurantStatus } from '../enums/restaurant.status.enum'
import { User } from 'src/modules/users/entities/user.entity'
import { RestaurantSchedule } from './restaurant-schedule.entity'
import { RestaurantTable } from './restaurant-tables.entity'
import { RestaurantStaffMember } from './restaurant-staff-members.entity'
import { Menu } from 'src/modules/menus/entities/menu.entity'
import { Product } from 'src/modules/products/entities/product.entity'

@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User, (user) => user.restaurants)
  user: User

  @Column('varchar')
  userId: string

  @Column('varchar')
  name: string

  @Column('varchar')
  status: RestaurantStatus

  @Column('varchar')
  isOpen: boolean

  @Column('varchar')
  addressLocation: string

  @Column('varchar')
  logoUrl: string

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