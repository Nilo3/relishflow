import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'

import { User } from 'src/modules/users/entities/user.entity'
import { Country } from 'src/modules/commons/entities/country.entity'

@Entity('documents_type')
export class DocumentType {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  name: string

  @ManyToOne(() => Country, (country: Country) => country.documentTypes)
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

  @OneToMany(() => User, (user) => user.documentType)
  users: User[]
}
