import { Injectable, HttpStatus, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { ResponseDto } from '@shared/helpers/response.helper'

import { DocumentType } from './entities/document-type.entity'
import { Country } from './entities/country.entity'
import { City } from './entities/city.entity'

interface SeedResult {
  countriesInserted: number
  citiesInserted: number
  documentTypesInserted: number
}

@Injectable()
export class CommonService {
  private readonly logger = new Logger(CommonService.name)

  constructor(
    @InjectRepository(DocumentType) private readonly documentTypesRepository: Repository<DocumentType>,
    @InjectRepository(Country) private readonly countriesRepository: Repository<Country>,
    @InjectRepository(City) private readonly citiesRepository: Repository<City>
  ) {}

  async seed(): Promise<ResponseDto<SeedResult>> {
    this.logger.log('Starting commons seed...')

    try {
      const countriesInserted = await this.seedCountries()
      const citiesInserted = await this.seedCities()
      const documentTypesInserted = await this.seedDocumentTypes()

      const result: SeedResult = { countriesInserted, citiesInserted, documentTypesInserted }

      this.logger.log('Commons seed completed. Countries: ' + countriesInserted.toString() + ', Cities: ' + citiesInserted.toString() + ', DocumentTypes: ' + documentTypesInserted.toString())

      return {
        success: true,
        code: 'SEED_COMPLETED',
        message: 'Seed completado exitosamente',
        httpCode: HttpStatus.OK,
        data: result
      }
    } catch (unknownError) {
      if (unknownError instanceof Error) {
        this.logger.error('Error during commons seed', unknownError)
      } else {
        this.logger.error('Error during commons seed: ' + String(unknownError))
      }

      return {
        success: false,
        code: 'SEED_ERROR',
        message: 'Ocurrió un error durante el seed',
        httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null
      }
    }
  }

  private async seedCountries(): Promise<number> {
    const countriesToSeed: Pick<Country, 'name' | 'code'>[] = [
      { name: 'Colombia', code: 'CO' },
      { name: 'Argentina', code: 'AR' },
      { name: 'España', code: 'ES' }
    ]

    let countriesInserted = 0

    for (const country of countriesToSeed) {
      const exists = await this.countriesRepository.findOne({ where: { code: country.code } })

      if (!exists) {
        await this.countriesRepository.save(this.countriesRepository.create(country))
        countriesInserted++
      }
    }

    return countriesInserted
  }

  private async seedCities(): Promise<number> {
    const citiesByCountry: Record<string, string[]> = {
      CO: ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga', 'Pereira', 'Santa Marta', 'Ibagué', 'Cúcuta'],
      AR: ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata', 'Mar del Plata', 'San Miguel de Tucumán', 'Salta', 'Santa Fe', 'Corrientes'],
      ES: ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Zaragoza', 'Málaga', 'Murcia', 'Palma', 'Las Palmas', 'Bilbao']
    }

    let citiesInserted = 0

    for (const [code, cityNames] of Object.entries(citiesByCountry)) {
      const country = await this.countriesRepository.findOne({ where: { code } })

      if (!country) continue

      const existingCities = await this.citiesRepository.find({ where: { name: In(cityNames), country: { id: country.id } }, relations: ['country'] })
      const existingPairs = new Set(existingCities.map((c) => `${c.name}|${country.id}`))

      const toCreate = cityNames.filter((name) => !existingPairs.has(`${name}|${country.id}`)).map((name) => this.citiesRepository.create({ name, country }))

      if (toCreate.length > 0) {
        await this.citiesRepository.save(toCreate)
        citiesInserted += toCreate.length
      }
    }

    return citiesInserted
  }

  private async seedDocumentTypes(): Promise<number> {
    const docsByCountry: Record<string, string[]> = {
      CO: ['CC', 'CE', 'NIT', 'Pasaporte'],
      AR: ['DNI', 'Pasaporte'],
      ES: ['NIE', 'NIF', 'Pasaporte']
    }

    let documentTypesInserted = 0

    for (const [code, docNames] of Object.entries(docsByCountry)) {
      const country = await this.countriesRepository.findOne({ where: { code } })

      if (!country) continue

      const existingDocs = await this.documentTypesRepository.find({ where: { name: In(docNames), country: { id: country.id } }, relations: ['country'] })
      const existingPairs = new Set(existingDocs.map((d) => `${d.name}|${country.id}`))

      const toCreate = docNames.filter((name) => !existingPairs.has(`${name}|${country.id}`)).map((name) => this.documentTypesRepository.create({ name, country }))

      if (toCreate.length > 0) {
        await this.documentTypesRepository.save(toCreate)
        documentTypesInserted += toCreate.length
      }
    }

    return documentTypesInserted
  }
}
