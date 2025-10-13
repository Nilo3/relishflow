export enum CommonsCodes {
  SEED_COMPLETED = 'SEED_COMPLETED',
  SEED_ERROR = 'SEED_ERROR',
  COUNTRIES_FETCHED = 'COUNTRIES_FETCHED',
  CITIES_FETCHED = 'CITIES_FETCHED',
  DOCUMENT_TYPES_FETCHED = 'DOCUMENT_TYPES_FETCHED',
  COUNTRY_CODE_REQUIRED = 'COUNTRY_CODE_REQUIRED',
  COUNTRY_NOT_FOUND = 'COUNTRY_NOT_FOUND'
}

export const CommonsMessages: Record<CommonsCodes, Record<string, string>> = {
  [CommonsCodes.SEED_COMPLETED]: {
    en: 'Seed completed successfully',
    es: 'Seed completado exitosamente'
  },
  [CommonsCodes.SEED_ERROR]: {
    en: 'An error occurred during seed',
    es: 'Ocurrió un error durante el seed'
  },
  [CommonsCodes.COUNTRIES_FETCHED]: {
    en: 'Countries fetched successfully',
    es: 'Países obtenidos correctamente'
  },
  [CommonsCodes.CITIES_FETCHED]: {
    en: 'Cities fetched successfully',
    es: 'Ciudades obtenidas correctamente'
  },
  [CommonsCodes.DOCUMENT_TYPES_FETCHED]: {
    en: 'Document types fetched successfully',
    es: 'Tipos de documento obtenidos correctamente'
  },
  [CommonsCodes.COUNTRY_CODE_REQUIRED]: {
    en: 'The parameter countryCode is required',
    es: 'El parámetro countryCode es requerido'
  },
  [CommonsCodes.COUNTRY_NOT_FOUND]: {
    en: 'Country not found',
    es: 'País no encontrado'
  }
}

export const COUNTRIES_TO_SEED: Array<{ name: string; code: string }> = [
  { name: 'Colombia', code: 'CO' },
  { name: 'Argentina', code: 'AR' },
  { name: 'España', code: 'ES' }
]

export const CITIES_BY_COUNTRY: Record<string, string[]> = {
  CO: ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga', 'Pereira', 'Santa Marta', 'Ibagué', 'Cúcuta'],
  AR: ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata', 'Mar del Plata', 'San Miguel de Tucumán', 'Salta', 'Santa Fe', 'Corrientes'],
  ES: ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Zaragoza', 'Málaga', 'Murcia', 'Palma', 'Las Palmas', 'Bilbao']
}

export const DOCS_BY_COUNTRY: Record<string, string[]> = {
  CO: ['CC', 'CE', 'NIT', 'Pasaporte'],
  AR: ['DNI', 'Pasaporte'],
  ES: ['NIE', 'NIF', 'Pasaporte']
}
