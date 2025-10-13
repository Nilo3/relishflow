import { Controller, Post, Get, Query } from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { ResponseDto } from '@shared/helpers/response.helper'

import { Public } from 'src/decorators/public.decorator'

import { CommonService } from './common.service'

@ApiTags('Commons')
@Controller('commons')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Post('seed')
  @Public()
  @ApiOperation({ summary: 'Seed countries, cities and document types (idempotent)' })
  async seed(): Promise<ResponseDto<{ countriesInserted: number; citiesInserted: number; documentTypesInserted: number }>> {
    return await this.commonService.seed()
  }

  @Get('countries')
  @Public()
  @ApiOperation({ summary: 'Obtener todos los países' })
  async getAllCountries() {
    return await this.commonService.getAllCountries()
  }

  @Get('cities')
  @Public()
  @ApiOperation({ summary: 'Obtener ciudades por país' })
  @ApiQuery({ name: 'countryCode', required: true })
  async getCitiesByCountry(@Query('countryCode') countryCode: string) {
    return await this.commonService.getCitiesByCountry(countryCode)
  }

  @Get('document-types')
  @Public()
  @ApiOperation({ summary: 'Obtener tipos de documento por país' })
  @ApiQuery({ name: 'countryCode', required: true })
  async getDocumentTypesByCountry(@Query('countryCode') countryCode: string) {
    return await this.commonService.getDocumentTypesByCountry(countryCode)
  }
}
