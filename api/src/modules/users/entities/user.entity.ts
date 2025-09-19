import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { UserRoles } from '@shared/modules/users/enums/roles.enum'
import { UserModel } from '@shared/modules/users/models/user.model'
import { Country } from 'src/modules/commons/entities/country.entity'
import { City } from 'src/modules/commons/entities/city.entity'
import { DocumentType } from 'src/modules/commons/entities/document-type.entity'
import { Restaurant } from 'src/modules/restaurants/entities/restaurant.entity'
import { Subscription } from 'src/modules/subscriptions/entities/subscription.entity'

@Entity('users')
export class User implements UserModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  name: string

  @Column('varchar')
  lastName: string

  @Column('varchar', { unique: true })
  email: string

  @ManyToOne(() => DocumentType, (documentType) => documentType.users)
  documentType: DocumentType

  @Column('varchar')
  documentNumber: string

  @ManyToOne(() => Country, (country) => country.users)
  country: Country

  @ManyToOne(() => City, (city) => city.users)
  city: City

  @Column('enum', { enum: UserRoles })
  role: UserRoles

  @Column('varchar')
  phone: string

  @Column('varchar')
  cognitoId: string

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

  @OneToMany(() => Restaurant, (restaurant) => restaurant.user)
  restaurants?: Restaurant[]

  @OneToMany(() => Subscription, (subscription) => subscription.user)
  subscriptions?: Subscription[]
}
