import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CommonController } from './common.controller'
import { CommonService } from './common.service'
import { Country } from './entities/country.entity'
import { City } from './entities/city.entity'
import { DocumentType } from './entities/document-type.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Country, City, DocumentType])],
  providers: [CommonService],
  controllers: [CommonController]
})
export class CommonModule {}
