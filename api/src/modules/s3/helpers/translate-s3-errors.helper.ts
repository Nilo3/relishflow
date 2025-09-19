import { HttpStatus } from '@nestjs/common'
import { S3Codes, S3Messages } from '@shared/modules/s3/s3.responses'

interface S3ErrorResponse {
  code: S3Codes;
  message: string;
  httpCode: number;
}

export function translateS3Error(error: any): S3ErrorResponse {
  const errorName = error?.name ?? error?.Code ?? 'UnknownError'

  const errorMap: Record<string, S3ErrorResponse> = {
    // Errores específicos de S3
    'AccessDenied': {
      code: S3Codes.AWS_ACCESS_DENIED,
      message: S3Messages[S3Codes.AWS_ACCESS_DENIED].en,
      httpCode: HttpStatus.FORBIDDEN
    },
    'NoSuchBucket': {
      code: S3Codes.AWS_NO_SUCH_BUCKET,
      message: S3Messages[S3Codes.AWS_NO_SUCH_BUCKET].en,
      httpCode: HttpStatus.NOT_FOUND
    },
    'NoSuchKey': {
      code: S3Codes.AWS_NO_SUCH_KEY,
      message: S3Messages[S3Codes.AWS_NO_SUCH_KEY].en,
      httpCode: HttpStatus.NOT_FOUND
    },
    'InvalidAccessKeyId': {
      code: S3Codes.AWS_INVALID_ACCESS_KEY_ID,
      message: S3Messages[S3Codes.AWS_INVALID_ACCESS_KEY_ID].en,
      httpCode: HttpStatus.UNAUTHORIZED
    },
    'SignatureDoesNotMatch': {
      code: S3Codes.AWS_SIGNATURE_DOES_NOT_MATCH,
      message: S3Messages[S3Codes.AWS_SIGNATURE_DOES_NOT_MATCH].en,
      httpCode: HttpStatus.UNAUTHORIZED
    },
    'RequestTimeTooSkewed': {
      code: S3Codes.AWS_REQUEST_TIME_TOO_SKEWED,
      message: S3Messages[S3Codes.AWS_REQUEST_TIME_TOO_SKEWED].en,
      httpCode: HttpStatus.BAD_REQUEST
    },
    'AccessControlListNotSupported': {
      code: S3Codes.AWS_ACCESS_CONTROL_LIST_NOT_SUPPORTED,
      message: S3Messages[S3Codes.AWS_ACCESS_CONTROL_LIST_NOT_SUPPORTED].en,
      httpCode: HttpStatus.BAD_REQUEST
    },

    // Errores genéricos de red/conexión
    'NetworkingError': {
      code: S3Codes.FILE_UPLOAD_ERROR,
      message: S3Messages[S3Codes.FILE_UPLOAD_ERROR].en,
      httpCode: HttpStatus.INTERNAL_SERVER_ERROR
    },
    'TimeoutError': {
      code: S3Codes.FILE_UPLOAD_ERROR,
      message: S3Messages[S3Codes.FILE_UPLOAD_ERROR].en,
      httpCode: HttpStatus.REQUEST_TIMEOUT
    },

    // Error por defecto
    'UnknownError': {
      code: S3Codes.FILE_UPLOAD_ERROR,
      message: S3Messages[S3Codes.FILE_UPLOAD_ERROR].en,
      httpCode: HttpStatus.INTERNAL_SERVER_ERROR
    }
  }

  return errorMap[errorName] || {
    code: S3Codes.FILE_UPLOAD_ERROR,
    message: S3Messages[S3Codes.FILE_UPLOAD_ERROR].en,
    httpCode: HttpStatus.INTERNAL_SERVER_ERROR
  }
}