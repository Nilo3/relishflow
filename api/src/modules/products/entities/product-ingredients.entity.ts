import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Product } from './product.entity'
import { Ingredients } from './ingredients.entity'

@Entity('product_ingredients')
export class ProductIngredients {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Product, (product) => product.ingredients)
  product: Product

  @ManyToOne(() => Ingredients, (ingredient) => ingredient.products)
  ingredient: Ingredients
}