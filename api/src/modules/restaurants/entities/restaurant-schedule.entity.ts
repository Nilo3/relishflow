import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { DaysSchedule } from '@shared/modules/restaurants/enums/days-schedule.enum'

import { Restaurant } from './restaurant.entity'

@Entity('restaurant_schedules')
export class RestaurantSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.schedules)
  restaurant: Restaurant

  @Column('enum', { enum: DaysSchedule })
  dayOfWeek: DaysSchedule

  @Column('time')
  openTime: string

  @Column('time')
  closeTime: string
}
