import { Injectable, HttpStatus, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { ResponseDto } from '@shared/helpers/response.helper'
import { CITIES_BY_COUNTRY, COUNTRIES_TO_SEED, DOCS_BY_COUNTRY, CommonsCodes, CommonsMessages } from '@shared/modules/commons/commons.constants'

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
        code: CommonsCodes.SEED_COMPLETED,
        message: CommonsMessages[CommonsCodes.SEED_COMPLETED].es,
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
        code: CommonsCodes.SEED_ERROR,
        message: CommonsMessages[CommonsCodes.SEED_ERROR].es,
        httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null
      }
    }
  }

  async getAllCountries(): Promise<ResponseDto<{ id: string; name: string; code: string }[]>> {
    const countries = await this.countriesRepository.find({ select: ['id', 'name', 'code'], order: { name: 'ASC' } })

    return {
      success: true,
      code: CommonsCodes.COUNTRIES_FETCHED,
      message: CommonsMessages[CommonsCodes.COUNTRIES_FETCHED].es,
      httpCode: HttpStatus.OK,
      data: countries
    }
  }

  async getCitiesByCountry(countryCode: string): Promise<ResponseDto<{ id: string; name: string }[]>> {
    if (!countryCode) {
      return {
        success: false,
        code: CommonsCodes.COUNTRY_CODE_REQUIRED,
        message: CommonsMessages[CommonsCodes.COUNTRY_CODE_REQUIRED].es,
        httpCode: HttpStatus.BAD_REQUEST,
        data: null
      }
    }

    const country = await this.countriesRepository.findOne({ where: { code: countryCode } })

    if (!country) {
      return {
        success: false,
        code: CommonsCodes.COUNTRY_NOT_FOUND,
        message: CommonsMessages[CommonsCodes.COUNTRY_NOT_FOUND].es,
        httpCode: HttpStatus.NOT_FOUND,
        data: null
      }
    }

    const cities = await this.citiesRepository.find({
      where: { country: { id: country.id } },
      select: ['id', 'name'],
      order: { name: 'ASC' }
    })

    return {
      success: true,
      code: CommonsCodes.CITIES_FETCHED,
      message: CommonsMessages[CommonsCodes.CITIES_FETCHED].es,
      httpCode: HttpStatus.OK,
      data: cities
    }
  }

  async getDocumentTypesByCountry(countryCode: string): Promise<ResponseDto<{ id: string; name: string }[]>> {
    if (!countryCode) {
      return {
        success: false,
        code: CommonsCodes.COUNTRY_CODE_REQUIRED,
        message: CommonsMessages[CommonsCodes.COUNTRY_CODE_REQUIRED].es,
        httpCode: HttpStatus.BAD_REQUEST,
        data: null
      }
    }

    const country = await this.countriesRepository.findOne({ where: { code: countryCode } })

    if (!country) {
      return {
        success: false,
        code: CommonsCodes.COUNTRY_NOT_FOUND,
        message: CommonsMessages[CommonsCodes.COUNTRY_NOT_FOUND].es,
        httpCode: HttpStatus.NOT_FOUND,
        data: null
      }
    }

    const documentTypes = await this.documentTypesRepository.find({
      where: { country: { id: country.id } },
      select: ['id', 'name'],
      order: { name: 'ASC' }
    })

    return {
      success: true,
      code: CommonsCodes.DOCUMENT_TYPES_FETCHED,
      message: CommonsMessages[CommonsCodes.DOCUMENT_TYPES_FETCHED].es,
      httpCode: HttpStatus.OK,
      data: documentTypes
    }
  }

  private async seedCountries(): Promise<number> {
    const countriesToSeed: Pick<Country, 'name' | 'code'>[] = COUNTRIES_TO_SEED

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
    const citiesByCountry: Record<string, string[]> = CITIES_BY_COUNTRY

    let citiesInserted = 0

    for (const [code, cityNames] of Object.entries(citiesByCountry)) {
      const country = await this.countriesRepository.findOne({ where: { code } })

      if (!country) continue

      const existingCities = await this.citiesRepository.find({ where: { name: In(cityNames), country: { id: country.id } }, relations: ['country'] })
      const existingPairs = new Set(existingCities.map((city) => `${city.name}|${country.id}`))

      const toCreate = cityNames.filter((name) => !existingPairs.has(`${name}|${country.id}`)).map((name) => this.citiesRepository.create({ name, country }))

      if (toCreate.length > 0) {
        await this.citiesRepository.save(toCreate)
        citiesInserted += toCreate.length
      }
    }

    return citiesInserted
  }

  private async seedDocumentTypes(): Promise<number> {
    const docsByCountry: Record<string, string[]> = DOCS_BY_COUNTRY

    let documentTypesInserted = 0

    for (const [code, docNames] of Object.entries(docsByCountry)) {
      const country = await this.countriesRepository.findOne({ where: { code } })

      if (!country) continue

      const existingDocs = await this.documentTypesRepository.find({ where: { name: In(docNames), country: { id: country.id } }, relations: ['country'] })
      const existingPairs = new Set(existingDocs.map((documentType) => `${documentType.name}|${country.id}`))

      const toCreate = docNames.filter((name) => !existingPairs.has(`${name}|${country.id}`)).map((name) => this.documentTypesRepository.create({ name, country }))

      if (toCreate.length > 0) {
        await this.documentTypesRepository.save(toCreate)
        documentTypesInserted += toCreate.length
      }
    }

    return documentTypesInserted
  }
}
