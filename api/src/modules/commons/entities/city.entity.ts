import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'

import { User } from 'src/modules/users/entities/user.entity'
import { Country } from 'src/modules/commons/entities/country.entity'

@Entity('cities')
export class City {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  name: string

  @ManyToOne(() => Country, (country: Country) => country.cities)
  country: Country

  @CreateDateColumn({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP'
  })
  createdAt: Date

  @CreateDateColumn({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP'
  })
  updatedAt: Date

  @OneToMany(() => User, (user: User) => user.city)
  users: User[]
}
