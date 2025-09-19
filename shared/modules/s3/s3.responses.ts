export enum S3Codes {
  FILE_UPLOADED = 'FILE_UPLOADED',
  FILE_DOWNLOADED = 'FILE_DOWNLOADED',
  FILE_DELETED = 'FILE_DELETED',
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  FILE_UPLOAD_ERROR = 'FILE_UPLOAD_ERROR',
  FILE_DOWNLOAD_ERROR = 'FILE_DOWNLOAD_ERROR',
  FILE_DELETE_ERROR = 'FILE_DELETE_ERROR',
  INVALID_FILENAME = 'INVALID_FILENAME',
  INVALID_BUCKET_NAME = 'INVALID_BUCKET_NAME',
  AWS_ACCESS_DENIED = 'AWS_ACCESS_DENIED',
  AWS_NO_SUCH_BUCKET = 'AWS_NO_SUCH_BUCKET',
  AWS_NO_SUCH_KEY = 'AWS_NO_SUCH_KEY',
  AWS_INVALID_ACCESS_KEY_ID = 'AWS_INVALID_ACCESS_KEY_ID',
  AWS_SIGNATURE_DOES_NOT_MATCH = 'AWS_SIGNATURE_DOES_NOT_MATCH',
  AWS_REQUEST_TIME_TOO_SKEWED = 'AWS_REQUEST_TIME_TOO_SKEWED',
  AWS_ACCESS_CONTROL_LIST_NOT_SUPPORTED = 'AWS_ACCESS_CONTROL_LIST_NOT_SUPPORTED'
}

export const S3Messages: Record<S3Codes, Record<string, string>> = {
  [S3Codes.FILE_UPLOADED]: {
    en: 'File uploaded successfully',
    es: 'Archivo subido exitosamente'
  },
  [S3Codes.FILE_UPLOAD_ERROR]: {
    en: 'Error uploading file',
    es: 'Error al subir el archivo'
  },
  [S3Codes.FILE_DOWNLOADED]: {
    en: 'File downloaded successfully',
    es: 'Archivo descargado exitosamente'
  },
  [S3Codes.FILE_DOWNLOAD_ERROR]: {
    en: 'Error downloading file',
    es: 'Error al descargar el archivo'
  },
  [S3Codes.FILE_DELETED]: {
    en: 'File deleted successfully',
    es: 'Archivo eliminado exitosamente'
  },
  [S3Codes.FILE_DELETE_ERROR]: {
    en: 'Error deleting file',
    es: 'Error al eliminar el archivo'
  },
  [S3Codes.FILE_NOT_FOUND]: {
    en: 'File not found',
    es: 'Archivo no encontrado'
  },
  [S3Codes.INVALID_FILENAME]: {
    en: 'Invalid filename',
    es: 'Nombre de archivo inválido'
  },
  [S3Codes.INVALID_BUCKET_NAME]: {
    en: 'Invalid bucket name',
    es: 'Nombre de bucket inválido'
  },
  [S3Codes.AWS_ACCESS_DENIED]: {
    en: 'AWS access denied',
    es: 'Acceso denegado a AWS'
  },
  [S3Codes.AWS_NO_SUCH_BUCKET]: {
    en: 'AWS bucket does not exist',
    es: 'El bucket de AWS no existe'
  },
  [S3Codes.AWS_NO_SUCH_KEY]: {
    en: 'AWS file key does not exist',
    es: 'La clave del archivo en AWS no existe'
  },
  [S3Codes.AWS_INVALID_ACCESS_KEY_ID]: {
    en: 'Invalid AWS access key ID',
    es: 'ID de clave de acceso AWS inválida'
  },
  [S3Codes.AWS_SIGNATURE_DOES_NOT_MATCH]: {
    en: 'AWS signature does not match',
    es: 'La firma de AWS no coincide'
  },
  [S3Codes.AWS_REQUEST_TIME_TOO_SKEWED]: {
    en: 'AWS request time is too skewed',
    es: 'El tiempo de la solicitud AWS está muy desfasado'
  },
  [S3Codes.AWS_ACCESS_CONTROL_LIST_NOT_SUPPORTED]: {
    en: 'AWS bucket does not support ACLs',
    es: 'El bucket de AWS no permite ACLs'
  }
};