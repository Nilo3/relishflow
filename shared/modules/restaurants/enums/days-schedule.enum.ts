export enum DaysSchedule {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6
}

export const DaysScheduleTranslate: Record<DaysSchedule, string> = {
  [DaysSchedule.SUNDAY]: 'Domingo',
  [DaysSchedule.MONDAY]: 'Lunes',
  [DaysSchedule.TUESDAY]: 'Martes',
  [DaysSchedule.WEDNESDAY]: 'Miércoles',
  [DaysSchedule.THURSDAY]: 'Jueves',
  [DaysSchedule.FRIDAY]: 'Viernes',
  [DaysSchedule.SATURDAY]: 'Sábado'
}