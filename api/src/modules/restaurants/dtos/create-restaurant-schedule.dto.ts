import { ApiProperty } from '@nestjs/swagger'
import { DaysSchedule } from '@shared/modules/restaurants/enums/days-schedule.enum'
import { IsEnum, IsString, Matches } from 'class-validator'

export class CreateRestaurantScheduleDto {
  @ApiProperty({
    example: DaysSchedule.MONDAY,
    description: 'The day of the week',
    required: true,
    enum: DaysSchedule
  })
  @IsEnum(DaysSchedule)
  dayOfWeek: DaysSchedule

  @ApiProperty({
    example: '09:00',
    description: 'The opening time of the restaurant (format HH:mm)',
    required: true
  })
  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'openTime must be in format HH:mm (00:00-23:59)'
  })
  openTime: string

  @ApiProperty({
    example: '22:00',
    description: 'The closing time of the restaurant (format HH:mm)',
    required: true
  })
  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'closeTime must be in format HH:mm (00:00-23:59)'
  })
  closeTime: string
}
