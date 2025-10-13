import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { User } from 'src/modules/users/entities/user.entity'
import { City } from 'src/modules/commons/entities/city.entity'
import { DocumentType } from 'src/modules/commons/entities/document-type.entity'

@Entity('countries')
export class Country {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  name: string

  @Column('varchar')
  code: string

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

  @OneToMany(() => User, (user) => user.country)
  users: User[]

  @OneToMany(() => City, (city: City): Country => city.country)
  cities: City[]

  @OneToMany(() => DocumentType, (documentType: DocumentType): Country => documentType.country)
  documentTypes: DocumentType[]
}
