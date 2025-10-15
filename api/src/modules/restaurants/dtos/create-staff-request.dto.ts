import { IsString, IsNotEmpty, IsEnum, IsBoolean, IsOptional, IsUUID } from 'class-validator'
import { ICreateStaffRequestDto } from '@shared/modules/restaurants/interfaces/create-staff-request.inteface'
import { RestaurantStaffMemberRole } from '@shared/modules/restaurants/enums/restaurant-staff-member-roles.enum'
import { ApiProperty } from '@nestjs/swagger'

export class CreateStaffRequestDto implements ICreateStaffRequestDto {
  @ApiProperty({
    example: '123456',
    description: 'The ID of the restaurant',
    required: true
  })
  @IsUUID('4', { message: 'restaurantId must be a valid UUID' })
  @IsNotEmpty({ message: 'Restaurant ID is required' })
  restaurantId: string

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the staff member',
    required: true
  })
  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string

  @ApiProperty({
    example: 'password123',
    description: 'The password of the staff member',
    required: true
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string

  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the staff member',
    required: true
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string

  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the staff member',
    required: true
  })
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string

  @ApiProperty({
    example: RestaurantStaffMemberRole.CASHIER,
    description: 'The role of the staff member',
    required: true,
    enum: RestaurantStaffMemberRole
  })
  @IsEnum(RestaurantStaffMemberRole)
  role: RestaurantStaffMemberRole

  @ApiProperty({
    example: true,
    description: 'Indicates if the staff member is active',
    required: false
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive?: boolean
}
