import { User } from 'src/modules/users/entities/user.entity'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { SubscriptionPlan } from './subscription-plan.entity'
import { SubscriptionPlanOptions } from '../enum/subscription-plan-options.enum'

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User, (user) => user.subscriptions)
  user: User

  @ManyToOne(() => SubscriptionPlan, (subscriptionPlan) => subscriptionPlan.subscriptions)
  subscriptionPlan: SubscriptionPlan

  @Column('varchar')
  startDate: Date

  @Column('varchar')
  endDate: Date
  
  @Column('enum', { enum: SubscriptionPlanOptions })
  billingCycle: SubscriptionPlanOptions
}