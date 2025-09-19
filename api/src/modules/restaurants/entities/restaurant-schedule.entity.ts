import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Restaurant } from './restaurant.entity'

@Entity('restaurant_schedules')
export class RestaurantSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.schedules)
  restaurant: Restaurant

  @Column('varchar')
  dayOfWeek: number

  @Column('time')
  openTime: string

  @Column('time')
  closeTime: string
}