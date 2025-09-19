import { Module } from '@nestjs/common'
import { UsersModule } from 'src/modules/users/users.module'
import { CognitoModule } from '../cognito/cognito.module'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [UsersModule, CognitoModule],
  exports: [AuthService]
})
export class AuthModule { }
