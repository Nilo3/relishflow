import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { S3Module } from '../s3/s3.module'
import { CognitoModule } from '../cognito/cognito.module'

import { RestaurantsController } from './restaurants.controller'
import { RestaurantsService } from './restaurants.service'
import { Restaurant } from './entities/restaurant.entity'
import { RestaurantTable } from './entities/restaurant-tables.entity'
import { RestaurantStaffMember } from './entities/restaurant-staff-members.entity'
import { RestaurantSchedule } from './entities/restaurant-schedule.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, RestaurantTable, RestaurantStaffMember, RestaurantSchedule]), S3Module, CognitoModule],
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
  exports: [RestaurantsService]
})
export class RestaurantsModule {}
