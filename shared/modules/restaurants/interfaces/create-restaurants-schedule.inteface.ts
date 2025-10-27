import { DaysSchedule } from '../enums/days-schedule.enum'

export interface ICreateRestaurantScheduleInterface {
  dayOfWeek: DaysSchedule
  openTime: string
  closeTime: string
}