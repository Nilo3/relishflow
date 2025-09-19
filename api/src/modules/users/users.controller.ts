import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger'

import { UserId } from 'src/decorators/user-id.decorator'
import { Roles } from 'src/decorators/roles.decorator'
import { ResponseDto } from '@shared/helpers/response.helper'

import { UserRoles } from '@shared/modules/users/enums/roles.enum'
import { UsersService } from './users.service'
import { USERS_BASE_PATH, USERS_PATHS } from '@shared/modules/users/users.endpoints'
import { IGetUserResponse } from '@shared/modules/users/interfaces/get-user-response.interface'
import { CreateUserRequestDto } from './dtos/create-user.dto'
import { UpdateUserRequestDto } from './dtos/update-user.dto'
import { ICreateUserResponse } from '@shared/modules/users/interfaces/create-user-response.interface'
import { IUpdateUserResponse } from '@shared/modules/users/interfaces/update-user-response.interface'

@ApiTags('Users')
@Controller(USERS_BASE_PATH)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ApiBearerAuth()
  @Roles(UserRoles.SuperAdmin, UserRoles.Tenant)
  @ApiHeader({ name: 'x-refresh-token' })
  @ApiHeader({ name: 'x-id-token' })
  @ApiOperation({ summary: 'Create a new user' })
  create(@Body() createUserDto: CreateUserRequestDto): Promise<ResponseDto<ICreateUserResponse>> {
    return this.usersService.create(createUserDto)
  }

  @Put()
  @ApiBearerAuth()
  @Roles(UserRoles.SuperAdmin, UserRoles.Tenant)
  @ApiHeader({ name: 'x-refresh-token' })
  @ApiHeader({ name: 'x-id-token' })
  @ApiOperation({ summary: 'Update a user' })
  update(@Body() updateUserDto: UpdateUserRequestDto): Promise<ResponseDto<IUpdateUserResponse>> {
    return this.usersService.update(updateUserDto)
  }

  @Get(USERS_PATHS.ME)
  @ApiBearerAuth()
  @Roles(UserRoles.SuperAdmin, UserRoles.Tenant)
  @ApiHeader({ name: 'x-refresh-token' })
  @ApiHeader({ name: 'x-id-token' })
  @ApiOperation({ summary: 'Get current user information' })
  findMe(@UserId() userId: string): Promise<ResponseDto<IGetUserResponse>> {
    return this.usersService.find(userId)
  }

  @Get(USERS_PATHS.GET_BY_ID)
  @ApiBearerAuth()
  @Roles(UserRoles.SuperAdmin, UserRoles.Tenant)
  @ApiHeader({ name: 'x-refresh-token' })
  @ApiHeader({ name: 'x-id-token' })
  @ApiOperation({ summary: 'Get user by ID' })
  find(@Param('id') userId: string): Promise<ResponseDto<IGetUserResponse>> {
    return this.usersService.find(userId)
  }

  @Delete(USERS_PATHS.DELETE)
  @ApiBearerAuth()
  @Roles(UserRoles.SuperAdmin, UserRoles.Tenant)
  @ApiHeader({ name: 'x-refresh-token' })
  @ApiHeader({ name: 'x-id-token' })
  @ApiOperation({ summary: 'Delete user from Cognito and database' })
  deleteUser(@Param('id') userId: string): Promise<ResponseDto<{ deleted: boolean }>> {
    return this.usersService.deleteUserFromCognitoAndDatabase(userId)
  }
}
