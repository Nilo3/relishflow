import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsEnum, IsOptional, IsUUID } from 'class-validator'

import { MenuStatus } from '../enums/menu-status.enum'

export class UpdateMenuRequestDto {
  @ApiPropertyOptional({ enum: MenuStatus, description: 'Menu status' })
  @IsEnum(MenuStatus)
  @IsOptional()
  status?: MenuStatus

  @ApiPropertyOptional({ type: [String], description: 'New list of product IDs for the menu', isArray: true })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  productIds?: string[]
}
