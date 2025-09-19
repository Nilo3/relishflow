import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { User } from 'src/modules/users/entities/user.entity'

@Entity('documents_type')
export class DocumentType {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar', { unique: true })
  name: string

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
