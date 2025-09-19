import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ProductIngredients } from './product-ingredients.entity'

@Entity('ingredients')
export class Ingredients {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  name: string

  @OneToMany(() => ProductIngredients, (productIngredients) => productIngredients.ingredient)
  products: ProductIngredients[]
}