import type { S3Client, PutObjectCommandInput, GetObjectCommandInput, DeleteObjectCommandInput, ObjectCannedACL } from '@aws-sdk/client-s3'

import { Readable } from 'stream'

import { Injectable, Logger } from '@nestjs/common'
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

import { ResponseDto } from '@shared/helpers/response.helper'
import { translateS3Error } from './helpers/translate-s3-errors.helper'
import S3Config from '../../configs/s3.config'
import { S3Codes, S3Messages } from '@shared/modules/s3/s3.responses'

@Injectable()
export class S3Service {
  private readonly s3: S3Client
  private readonly logger = new Logger(S3Service.name)

  constructor() {
    this.s3 = S3Config
  }

  async upload(key: string, file: Buffer | Readable, contentType: string): Promise<ResponseDto<string>> {
    this.logger.debug(`Subiendo archivo a S3 en la ruta ${key}...`)

    const params: PutObjectCommandInput = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType
    }

    try {
      const command = new PutObjectCommand(params)

      await this.s3.send(command)

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${encodeURIComponent(params.Key!)}`

      this.logger.debug(`Archivo subido a S3 en la ruta ${key}`)

      return {
        success: true,
        code: S3Codes.FILE_UPLOADED,
        message: S3Messages[S3Codes.FILE_UPLOADED].en,
        httpCode: 200,
        data: fileUrl
      }
    } catch (error: unknown) {
      this.logger.error(`Ocurrió un error al subir el archivo ${key}`, (error as { stack?: string }).stack)

      const errorMessage = translateS3Error(error)

      if (errorMessage) {
        return {
          success: false,
          code: errorMessage.code,
          message: errorMessage.message,
          httpCode: errorMessage.httpCode,
          data: null
        }
      }

      return {
        success: false,
        code: S3Codes.FILE_UPLOAD_ERROR,
        message: S3Messages[S3Codes.FILE_UPLOAD_ERROR].en,
        httpCode: 500,
        data: null
      }
    }
  }



  async downloadFile(bucketName: string, key: string): Promise<ResponseDto<Buffer>> {
    this.logger.debug(`Descargando archivo ${key} de S3...`)

    const params: GetObjectCommandInput = {
      Bucket: bucketName,
      Key: key
    }

    try {
      const command = new GetObjectCommand(params)
      const { Body } = await this.s3.send(command)

      if (!Body) {
        return {
          success: false,
          code: S3Codes.FILE_NOT_FOUND,
          message: S3Messages[S3Codes.FILE_NOT_FOUND].en,
          httpCode: 404,
          data: null
        }
      }

      if (Body instanceof Readable) {
        const chunks: Uint8Array[] = []

        for await (const chunk of Body) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          chunks.push(chunk)
        }

        this.logger.debug(`Archivo ${key} descargado de S3`)

        return {
          success: true,
          code: S3Codes.FILE_DOWNLOADED,
          message: S3Messages[S3Codes.FILE_DOWNLOADED].en,
          httpCode: 200,
          data: Buffer.concat(chunks)
        }
      } else if (Body instanceof Blob) {
        const arrayBuffer = await (Body as Blob).arrayBuffer()

        this.logger.debug(`Archivo ${key} descargado de S3`)

        return {
          success: true,
          code: S3Codes.FILE_DOWNLOADED,
          message: S3Messages[S3Codes.FILE_DOWNLOADED].en,
          httpCode: 200,
          data: Buffer.from(arrayBuffer)
        }
      } else {
        return {
          success: false,
          code: S3Codes.FILE_DOWNLOAD_ERROR,
          message: S3Messages[S3Codes.FILE_DOWNLOAD_ERROR].en,
          httpCode: 500,
          data: null
        }
      }
    } catch (error: unknown) {
      this.logger.error(`Ocurrió un error al descargar el archivo ${key}`, (error as { stack?: string }).stack)

      const errorMessage = translateS3Error(error)

      if (errorMessage) {
        return {
          success: false,
          code: errorMessage.code,
          message: errorMessage.message,
          httpCode: errorMessage.httpCode,
          data: null
        }
      }

      return {
        success: false,
        code: S3Codes.FILE_DOWNLOAD_ERROR,
        message: S3Messages[S3Codes.FILE_DOWNLOAD_ERROR].en,
        httpCode: 500,
        data: null
      }
    }
  }

  async downloadImage(filename: string): Promise<ResponseDto<Uint8Array>> {
    if (!filename) {
      return {
        success: false,
        code: S3Codes.INVALID_FILENAME,
        message: S3Messages[S3Codes.INVALID_FILENAME].en,
        httpCode: 400,
        data: null
      }
    }

    const bucketName = process.env.S3_BUCKET_NAME

    if (!bucketName) {
      return {
        success: false,
        code: S3Codes.INVALID_BUCKET_NAME,
        message: S3Messages[S3Codes.INVALID_BUCKET_NAME].en,
        httpCode: 500,
        data: null
      }
    }

    const params = {
      Bucket: bucketName,
      Key: filename
    }

    this.logger.debug(`Descargando archivo ${filename} de S3...`)

    try {
      const data = await this.s3.send(new GetObjectCommand(params))

      if (!data.Body) {
        return {
          success: false,
          code: S3Codes.FILE_NOT_FOUND,
          message: S3Messages[S3Codes.FILE_NOT_FOUND].en,
          httpCode: 404,
          data: null
        }
      }

      const body = await data.Body.transformToByteArray()

      this.logger.debug(`Archivo ${filename} descargado de S3`)

      return {
        success: true,
        code: S3Codes.FILE_DOWNLOADED,
        message: S3Messages[S3Codes.FILE_DOWNLOADED].en,
        httpCode: 200,
        data: body
      }
    } catch (error: unknown) {
      this.logger.error(`Ocurrió un error al descargar la imagen ${filename}`, (error as { stack?: string }).stack)

      const errorMessage = translateS3Error(error)

      if (errorMessage) {
        return {
          success: false,
          code: errorMessage.code,
          message: errorMessage.message,
          httpCode: errorMessage.httpCode,
          data: null
        }
      }

      return {
        success: false,
        code: S3Codes.FILE_DOWNLOAD_ERROR,
        message: S3Messages[S3Codes.FILE_DOWNLOAD_ERROR].en,
        httpCode: 500,
        data: null
      }
    }
  }

  async deleteFile(filename: string): Promise<ResponseDto<null>> {
    if (!filename) {
      return {
        success: false,
        code: S3Codes.INVALID_FILENAME,
        message: S3Messages[S3Codes.INVALID_FILENAME].en,
        httpCode: 400,
        data: null
      }
    }

    const bucketName = process.env.S3_BUCKET_NAME

    if (!bucketName) {
      return {
        success: false,
        code: S3Codes.INVALID_BUCKET_NAME,
        message: S3Messages[S3Codes.INVALID_BUCKET_NAME].en,
        httpCode: 500,
        data: null
      }
    }

    const params: DeleteObjectCommandInput = {
      Bucket: bucketName,
      Key: filename
    }

    this.logger.debug(`Eliminando archivo ${filename} de S3...`)

    try {
      await this.s3.send(new DeleteObjectCommand(params))
      this.logger.debug(`Archivo ${filename} eliminado de S3`)

      return {
        success: true,
        code: S3Codes.FILE_DELETED,
        message: S3Messages[S3Codes.FILE_DELETED].en,
        httpCode: 200,
        data: null
      }
    } catch (error: unknown) {
      this.logger.error(`Ocurrió un error al eliminar el archivo ${filename}`, (error as { stack?: string }).stack)

      const errorMessage = translateS3Error(error)

      if (errorMessage) {
        return {
          success: false,
          code: errorMessage.code,
          message: errorMessage.message,
          httpCode: errorMessage.httpCode,
          data: null
        }
      }

      return {
        success: false,
        code: S3Codes.FILE_DELETE_ERROR,
        message: S3Messages[S3Codes.FILE_DELETE_ERROR].en,
        httpCode: 500,
        data: null
      }
    }
  }
}