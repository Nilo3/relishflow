import { Controller, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
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
}
