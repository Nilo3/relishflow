import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Subscription } from './subscription.entity'

@Entity('subscription_plans')
export class SubscriptionPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  name: string

  @Column('varchar')
  description: string

  @Column('varchar')
  monthlyPrice: number

  @Column('varchar')
  yearlyPrice: number

  @Column('varchar')
  maxRestaurants: number

  @Column('varchar')
  isActive: boolean

  @OneToMany(() => Subscription, (subscription) => subscription.subscriptionPlan)
  subscriptions: Subscription[]
}