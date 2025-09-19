import { Controller, Post, Get, Delete, Param, Body, Res, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiHeader, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { Response } from 'express'

// Definir el tipo para el archivo subido
interface MulterFile {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  buffer: Buffer
  size: number
}

import { ResponseDto } from '@shared/helpers/response.helper'
import { S3Service } from './s3.service'
import { ListObjectsV2Command } from '@aws-sdk/client-s3'

@ApiTags('S3 - Testing Endpoints')
@Controller('testing/s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) { }

  @Post('upload')
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-refresh-token' })
  @ApiHeader({ name: 'x-id-token' })
  @ApiOperation({
    summary: 'Upload a file to S3 (Testing endpoint)',
    description: 'Este endpoint es para testing. En producción, S3Service debe usarse internamente en otros servicios.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo a subir'
        },
        key: {
          type: 'string',
          description: 'S3 key/path for the file',
          example: 'uploads/my-file.jpg'
        }
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: MulterFile,
    @Body('key') key: string
  ): Promise<ResponseDto<string>> {
    if (!file) {
      return {
        success: false,
        code: 'FILE_REQUIRED',
        message: 'Archivo requerido',
        httpCode: 400,
        data: null
      }
    }

    if (!key) {
      return {
        success: false,
        code: 'KEY_REQUIRED',
        message: 'Clave S3 requerida',
        httpCode: 400,
        data: null
      }
    }

    return this.s3Service.upload(key, file.buffer, file.mimetype)
  }

  /**
   * Descarga un archivo de S3.
   *
   * - Se recomienda SIEMPRE subir y descargar usando la key con extensión (ej: archivo.xlsx).
   * - Si el parámetro recibido no tiene extensión, buscar una coincidencia en S3.
   * - Si encuentra una coincidencia, la usará para la descarga y sugerirá el nombre correcto.
   * - Si no la encuentra, retorna error 404.
   *
   * @param filename Nombre del archivo (con o sin extensión)
   */
  @Get('download/:filename')
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-refresh-token' })
  @ApiHeader({ name: 'x-id-token' })
  @ApiOperation({
    summary: 'Download a file from S3 (Testing endpoint)',
    description: `Se recomienda SIEMPRE usar la key con extensión. Si no se pasa extensión, el backend intentará buscar una coincidencia en S3. Si la encuentra, la usará para la descarga.`
  })
  async downloadFile(
    @Param('filename') filename: string,
    @Res() res: Response
  ): Promise<void> {
    let keyToDownload = filename
    let realFilename = filename
    const bucketName = process.env.S3_BUCKET_NAME

    // Si el nombre no tiene extensión, buscar una coincidencia en S3
    if (!filename.includes('.')) {
      const { S3Client } = await import('@aws-sdk/client-s3')
      const s3 = new S3Client({ region: process.env.AWS_REGION })
      const listCommand = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: filename
      })
      const result = await s3.send(listCommand)
      // Buscar la primera coincidencia que empiece con el nombre base
      const found = result.Contents?.find(obj => obj.Key?.startsWith(filename + '.'))
      if (found?.Key) {
        keyToDownload = found.Key
        realFilename = found.Key.split('/').pop() ?? found.Key
      } else {
        throw new BadRequestException('Archivo no encontrado o sin extensión. Usa la key completa con extensión.')
      }
    }

    // Descargar el archivo usando la key real
    const downloadResult = await this.s3Service.downloadImage(keyToDownload)

    if (!downloadResult.success || !downloadResult.data) {
      res.status(downloadResult.httpCode).json(downloadResult)
      return
    }

    // Determinar el tipo de contenido basado en la extensión
    const extension = realFilename.split('.').pop()?.toLowerCase()
    let contentType = 'application/octet-stream'
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg'
        break
      case 'png':
        contentType = 'image/png'
        break
      case 'gif':
        contentType = 'image/gif'
        break
      case 'pdf':
        contentType = 'application/pdf'
        break
      case 'txt':
        contentType = 'text/plain'
        break
      case 'doc':
        contentType = 'application/msword'
        break
      case 'docx':
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        break
      case 'xls':
        contentType = 'application/vnd.ms-excel'
        break
      case 'xlsx':
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        break
    }

    // Configurar headers para descarga
    res.setHeader('Content-Type', contentType)
    res.setHeader('Content-Disposition', `attachment; filename="${realFilename}"`)
    res.setHeader('Content-Length', downloadResult.data.length.toString())

    // Enviar el archivo
    res.send(Buffer.from(downloadResult.data))
  }

  @Get('view/:filename')
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-refresh-token' })
  @ApiHeader({ name: 'x-id-token' })
  @ApiOperation({
    summary: 'View a file from S3 (Testing endpoint)',
    description: 'Este endpoint es para testing. En producción, S3Service debe usarse internamente en otros servicios.'
  })
  async viewFile(
    @Param('filename') filename: string,
    @Res() res: Response
  ): Promise<void> {
    const result = await this.s3Service.downloadImage(filename)

    if (!result.success || !result.data) {
      res.status(result.httpCode).json(result)
      return
    }

    // Determinar el tipo de contenido basado en la extensión
    const extension = filename.split('.').pop()?.toLowerCase()
    let contentType = 'application/octet-stream'

    switch (extension) {
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg'
        break
      case 'png':
        contentType = 'image/png'
        break
      case 'gif':
        contentType = 'image/gif'
        break
      case 'pdf':
        contentType = 'application/pdf'
        break
      case 'txt':
        contentType = 'text/plain'
        break
    }

    // Configurar headers para visualización
    res.setHeader('Content-Type', contentType)
    res.setHeader('Content-Length', result.data.length.toString())

    // Enviar el archivo
    res.send(Buffer.from(result.data))
  }

  @Delete('delete/:filename')
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-refresh-token' })
  @ApiHeader({ name: 'x-id-token' })
  @ApiOperation({
    summary: 'Delete a file from S3 (Testing endpoint)',
    description: 'Este endpoint es para testing. En producción, S3Service debe usarse internamente en otros servicios.'
  })
  async deleteFile(@Param('filename') filename: string): Promise<ResponseDto<null>> {
    return this.s3Service.deleteFile(filename)
  }

  @Get('url/:filename')
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-refresh-token' })
  @ApiHeader({ name: 'x-id-token' })
  @ApiOperation({
    summary: 'Get the public URL of a file in S3 (Testing endpoint)',
    description: 'Este endpoint es para testing. En producción, S3Service debe usarse internamente en otros servicios.'
  })
  async getFileUrl(@Param('filename') filename: string): Promise<ResponseDto<string>> {
    const bucketName = process.env.S3_BUCKET_NAME
    const region = process.env.AWS_REGION

    if (!bucketName) {
      return {
        success: false,
        code: 'INVALID_BUCKET_NAME',
        message: 'Nombre de bucket inválido',
        httpCode: 500,
        data: null
      }
    }

    const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${encodeURIComponent(filename)}`

    return {
      success: true,
      code: 'FILE_URL_GENERATED',
      message: 'URL del archivo generada exitosamente',
      httpCode: 200,
      data: fileUrl
    }
  }


}