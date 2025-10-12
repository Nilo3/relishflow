import { Repository } from 'typeorm'
import { HttpStatus, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ResponseDto } from '@shared/helpers/response.helper'
import { UserCodes, UserMessages } from '@shared/modules/users/users.constants'
import { ICreateUserResponse } from '@shared/modules/users/interfaces/create-user-response.interface'
import { IUpdateUserResponse } from '@shared/modules/users/interfaces/update-user-response.interface'
import { IGetUserResponse } from '@shared/modules/users/interfaces/get-user-response.interface'

import { CognitoService } from '../cognito/cognito.service'

import { CreateUserRequestDto } from './dtos/create-user.dto'
import { UpdateUserRequestDto } from './dtos/update-user.dto'
import { User } from './entities/user.entity'

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name)
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly cognitoService: CognitoService
  ) {}

  async create(createUserDto: CreateUserRequestDto): Promise<ResponseDto<ICreateUserResponse>> {
    try {
      // Check if user already exists
      const existingUser = await this.usersRepository.findOne({
        where: [{ email: createUserDto.email }]
      })

      if (existingUser) {
        return {
          success: false,
          code: UserCodes.USER_ALREADY_EXISTS,
          message: UserMessages[UserCodes.USER_ALREADY_EXISTS].en,
          httpCode: HttpStatus.CONFLICT,
          data: null
        }
      }

      this.logger.log(`Creating user ${createUserDto.name} ${createUserDto.lastName} - ${createUserDto.role}...`)

      // Create new user
      const user = this.usersRepository.create(createUserDto)
      const savedUser = await this.usersRepository.save(user)

      // Map entity to response
      const userResponse: ICreateUserResponse = {
        id: savedUser.id,
        name: savedUser.name,
        lastName: savedUser.lastName,
        email: savedUser.email,
        documentNumber: savedUser.documentNumber,
        phone: savedUser.phone,
        role: savedUser.role,
        createdAt: savedUser.createdAt,
        updatedAt: savedUser.updatedAt
      }

      this.logger.log(`User ${userResponse.id} created successfully`)

      return {
        success: true,
        code: UserCodes.USER_CREATED,
        message: UserMessages[UserCodes.USER_CREATED].en,
        httpCode: HttpStatus.CREATED,
        data: userResponse
      }
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`, error.stack)

      return {
        success: false,
        code: UserCodes.ERROR_CREATING_USER,
        message: UserMessages[UserCodes.ERROR_CREATING_USER].en,
        httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null
      }
    }
  }

  async update(updateUserDto: UpdateUserRequestDto): Promise<ResponseDto<IUpdateUserResponse>> {
    try {
      this.logger.log(`Updating user ${updateUserDto.id}...`)

      // Check if user exists
      const existingUser = await this.usersRepository.findOne({
        where: { id: updateUserDto.id }
      })

      if (!existingUser) {
        return {
          success: false,
          code: UserCodes.USER_NOT_FOUND,
          message: UserMessages[UserCodes.USER_NOT_FOUND].en,
          httpCode: HttpStatus.NOT_FOUND,
          data: null
        }
      }

      // Update user
      await this.usersRepository.update({ id: updateUserDto.id }, updateUserDto)

      // Get updated user
      const updatedUser = await this.usersRepository.findOne({
        where: { id: updateUserDto.id }
      })

      if (!updatedUser) {
        return {
          success: false,
          code: UserCodes.ERROR_UPDATING_USER,
          message: UserMessages[UserCodes.ERROR_UPDATING_USER].en,
          httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
          data: null
        }
      }

      // Map entity to response
      const userResponse: IUpdateUserResponse = {
        id: updatedUser.id,
        name: updatedUser.name,
        surname: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
      }

      this.logger.log(`User ${userResponse.id} updated successfully`)

      return {
        success: true,
        code: UserCodes.USER_UPDATED,
        message: UserMessages[UserCodes.USER_UPDATED].en,
        httpCode: HttpStatus.OK,
        data: userResponse
      }
    } catch (error) {
      this.logger.error(`Error updating user: ${error.message}`, error.stack)

      return {
        success: false,
        code: UserCodes.ERROR_UPDATING_USER,
        message: UserMessages[UserCodes.ERROR_UPDATING_USER].en,
        httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null
      }
    }
  }

  async find(id: string): Promise<ResponseDto<IGetUserResponse>> {
    try {
      this.logger.log(`Finding user ${id}...`)

      const user = await this.usersRepository.findOne({ where: { id } })

      if (!user) {
        return {
          success: false,
          code: UserCodes.USER_NOT_FOUND,
          message: UserMessages[UserCodes.USER_NOT_FOUND].en,
          httpCode: HttpStatus.NOT_FOUND,
          data: null
        }
      }

      // Map entity to response
      const userResponse: IGetUserResponse = {
        id: user.id,
        name: user.name,
        surname: user.lastName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }

      this.logger.log(`User ${id} found`)

      return {
        success: true,
        code: UserCodes.USER_FOUND,
        message: UserMessages[UserCodes.USER_FOUND].en,
        httpCode: HttpStatus.OK,
        data: userResponse
      }
    } catch (error) {
      this.logger.error(`Error finding user: ${error.message}`, error.stack)

      return {
        success: false,
        code: UserCodes.ERROR_FINDING_USER,
        message: UserMessages[UserCodes.ERROR_FINDING_USER].en,
        httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null
      }
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { email } })

    return user
  }

  async findByIdCognito(cognitoId: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { cognitoId } })

    return user
  }

  async delete(id: string): Promise<ResponseDto<{ deleted: boolean }>> {
    try {
      this.logger.log(`Deleting user ${id}...`)

      const user = await this.usersRepository.findOne({ where: { id } })

      if (!user) {
        return {
          success: false,
          code: UserCodes.USER_NOT_FOUND,
          message: UserMessages[UserCodes.USER_NOT_FOUND].en,
          httpCode: HttpStatus.NOT_FOUND,
          data: null
        }
      }

      await this.usersRepository.delete({ id })

      this.logger.log(`User ${id} deleted successfully`)

      return {
        success: true,
        code: UserCodes.USER_DELETED,
        message: UserMessages[UserCodes.USER_DELETED].en,
        httpCode: HttpStatus.OK,
        data: { deleted: true }
      }
    } catch (error) {
      this.logger.error(`Error deleting user: ${error.message}`, error.stack)

      return {
        success: false,
        code: UserCodes.ERROR_DELETING_USER,
        message: UserMessages[UserCodes.ERROR_DELETING_USER].en,
        httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null
      }
    }
  }

  /**
   * Elimina un usuario tanto de Cognito como de la base de datos
   * @param userId ID del usuario a eliminar
   * @returns Resultado de la eliminación
   */
  async deleteUserFromCognitoAndDatabase(userId: string): Promise<ResponseDto<{ deleted: boolean }>> {
    try {
      this.logger.log(`Eliminando usuario ${userId} de Cognito y base de datos...`)

      // Buscar usuario en base de datos por ID
      const dbUser = await this.usersRepository.findOne({ where: { id: userId } })

      if (!dbUser) {
        return {
          success: false,
          code: UserCodes.USER_NOT_FOUND,
          message: UserMessages[UserCodes.USER_NOT_FOUND].en,
          httpCode: HttpStatus.NOT_FOUND,
          data: null
        }
      }

      // Eliminar de Cognito usando AdminDeleteUserCommand
      this.logger.log(`Eliminando usuario ${dbUser.email} de Cognito`)
      const cognitoResult = await this.cognitoService.deleteUser(dbUser.email)

      if (!cognitoResult.success) {
        this.logger.error(`Error eliminando usuario de Cognito: ${cognitoResult.message}`)
        return {
          success: false,
          code: UserCodes.ERROR_DELETING_USER,
          message: `Error eliminando usuario de Cognito: ${cognitoResult.message}`,
          httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
          data: null
        }
      }

      // Eliminar de base de datos
      const deleteFromDbResult = await this.delete(dbUser.id)

      if (!deleteFromDbResult.success) {
        this.logger.error('Error eliminando usuario de base de datos', deleteFromDbResult)
        return {
          success: false,
          code: UserCodes.ERROR_DELETING_USER,
          message: 'Error eliminando usuario de base de datos',
          httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
          data: null
        }
      }

      this.logger.log(`Usuario ${dbUser.email} eliminado exitosamente de ambos sistemas`)

      return {
        success: true,
        code: UserCodes.USER_DELETED,
        message: 'Usuario eliminado exitosamente de Cognito y base de datos',
        httpCode: HttpStatus.OK,
        data: { deleted: true }
      }
    } catch (error) {
      this.logger.error(`Error eliminando usuario ${userId}:`, error)

      return {
        success: false,
        code: UserCodes.ERROR_DELETING_USER,
        message: 'Error interno del servidor',
        httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null
      }
    }
  }
}