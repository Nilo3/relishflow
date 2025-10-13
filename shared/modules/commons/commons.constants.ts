export enum CommonsCodes {
  SEED_COMPLETED = 'SEED_COMPLETED',
  SEED_ERROR = 'SEED_ERROR'
}

export const CommonsMessages: Record<CommonsCodes, Record<string, string>> = {
  [CommonsCodes.SEED_COMPLETED]: {
    en: 'Seed completed successfully',
    es: 'Seed completado exitosamente'
  },
  [CommonsCodes.SEED_ERROR]: {
    en: 'An error occurred during seed',
    es: 'Ocurrió un error durante el seed'
  }
}


