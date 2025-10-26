import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { RestaurantStaffMemberRole } from '@shared/modules/restaurants/enums/restaurant-staff-member-roles.enum'

import { Restaurant } from './restaurant.entity'

@Entity('restaurant_staff_members')
export class RestaurantStaffMember {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  cognitoId: string

  @Column('varchar', { unique: true })
  email: string

  @Column('varchar')
  name: string

  @Column('varchar')
  lastName: string

  @Column('enum', { enum: RestaurantStaffMemberRole })
  role: RestaurantStaffMemberRole

  @Column('boolean', { default: true })
  isActive: boolean

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

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.staffMembers)
  restaurant: Restaurant
}
