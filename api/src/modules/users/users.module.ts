import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { User } from './entities/user.entity'
import { CognitoModule } from '../cognito/cognito.module'
import { DocumentType } from '../commons/entities/document-type.entity'
import { Country } from '../commons/entities/country.entity'
import { City } from '../commons/entities/city.entity'
import { Restaurant } from '../restaurants/entities/restaurant.entity'
import { RestaurantSchedule } from '../restaurants/entities/restaurant-schedule.entity'
import { RestaurantTable } from '../restaurants/entities/restaurant-tables.entity'
import { RestaurantStaffMember } from '../restaurants/entities/restaurant-staff-members.entity'
import { Menu } from '../menus/entities/menu.entity'
import { Product } from '../products/entities/product.entity'
import { ProductCategory } from '../products/entities/product-category.entity'
import { ProductIngredients } from '../products/entities/product-ingredients.entity'
import { Ingredients } from '../products/entities/ingredients.entity'
import { ProductOrder } from '../orders/entities/product-order.entity'
import { Order } from '../orders/entities/order.entity'
import { Bill } from '../orders/entities/bill.entity'
import { Subscription } from '../subscriptions/entities/subscription.entity'
import { SubscriptionPlan } from '../subscriptions/entities/subscription-plan.entity'

@Module({
  imports: [TypeOrmModule.forFeature([
    User, 
    DocumentType, 
    Country, 
    City, 
    Restaurant, 
    RestaurantSchedule,
    RestaurantTable,
    RestaurantStaffMember,
    Menu,
    Product,
    ProductCategory,
    ProductIngredients,
    Ingredients,
    ProductOrder,
    Order,
    Bill,
    Subscription,
    SubscriptionPlan
  ]), CognitoModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
