import { DaysSchedule } from '../enums/days-schedule.enum';

export interface IFindAllRestaurantsSchedule {
    id: string;
    dayOfWeek: DaysSchedule;
    openTime: string;
    closeTime: string;
}