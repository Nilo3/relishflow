import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { RestaurantStaffMemberRole } from '@shared/modules/restaurants/enums/restaurant-staff-member-roles.enum'

import { Restaurant } from './restaurant.entity'

@Entity('restaurant_staff_members')
export class RestaurantStaffMember {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  name: string

  @Column('enum', { enum: RestaurantStaffMemberRole })
  role: RestaurantStaffMemberRole

  @Column('varchar')
  loginCode: string

  @Column('boolean', { default: true })
  isActive: boolean

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.staffMembers)
  restaurant: Restaurant
}
