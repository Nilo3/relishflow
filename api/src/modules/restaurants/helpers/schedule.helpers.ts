export class ScheduleHelpers {
  /**
   * Verifica si hay solapamiento entre dos rangos de horarios
   * Maneja correctamente los horarios que cruzan la medianoche
   */
  static hasTimeOverlap(schedule1: { openTime: string; closeTime: string }, schedule2: { openTime: string; closeTime: string }): boolean {
    const [open1, close1] = [this.parseTime(schedule1.openTime), this.parseTime(schedule1.closeTime)]
    const [open2, close2] = [this.parseTime(schedule2.openTime), this.parseTime(schedule2.closeTime)]

    // Caso normal (sin cruce de medianoche)
    if (open1 <= close1 && open2 <= close2) {
      return !(close1 <= open2 || close2 <= open1)
    }

    // Caso con cruce de medianoche para schedule1
    if (open1 > close1) {
      return !(close1 <= open2 && close2 <= open1)
    }

    // Caso con cruce de medianoche para schedule2
    if (open2 > close2) {
      return !(close2 <= open1 && close1 <= open2)
    }

    return true
  }

  /**
   * Convierte una hora en formato "HH:mm" a minutos desde medianoche
   */
  static parseTime(time: string): number {
    const [hours, minutes] = time.split(':').map(Number)

    return hours * 60 + minutes
  }

  /**
   * Verifica si una hora está dentro del rango de un horario
   * Maneja correctamente horarios que cruzan la medianoche
   */
  static isTimeInRange(targetTime: string, schedule: { openTime: string; closeTime: string }): boolean {
    const target = this.parseTime(targetTime)
    const open = this.parseTime(schedule.openTime)
    const close = this.parseTime(schedule.closeTime)

    // Caso normal (sin cruce de medianoche)
    if (open <= close) {
      return target >= open && target <= close
    }

    // Caso con cruce de medianoche
    return target >= open || target <= close
  }

  /**
   * Valida que la hora tenga el formato correcto "HH:mm"
   */
  static isValidTimeFormat(time: string): boolean {
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/

    return timeRegex.test(time)
  }

  /**
   * Verifica si dos horarios son exactamente iguales
   */
  static areSchedulesEqual(schedule1: { openTime: string; closeTime: string; dayOfWeek: number }, schedule2: { openTime: string; closeTime: string; dayOfWeek: number }): boolean {
    return schedule1.dayOfWeek === schedule2.dayOfWeek && schedule1.openTime === schedule2.openTime && schedule1.closeTime === schedule2.closeTime
  }
}
