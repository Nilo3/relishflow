import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Restaurant } from './restaurant.entity'
import { RestaurantStaffMemberRole } from '@shared/modules/restaurants/enums/restaurant-staff-member-roles.enum'

@Entity('restaurant_staff_members')
export class RestaurantStaffMember {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.staffMembers)
  restaurant: Restaurant

  @Column('varchar')
  name: string

  @Column('varchar')
  role: RestaurantStaffMemberRole

  @Column('varchar')
  loginCode: string

  @Column('varchar')
  isActive: boolean
}