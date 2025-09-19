import type { Request } from 'express'
import type { UserRoles } from 'src/modules/users/enums/roles.enum'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ENV?: 'development' | 'release' | 'production'
      DB_HOST?: string
      DB_PORT?: number
      DB_USERNAME?: string
      DB_PASSWORD?: string
      DB_NAME?: string
      SSL_REJECT_UNAUTHORIZED?: string
      AUTO_LOAD_ENTITIES?: string
      SYNCHRONIZE?: string
      DEFAULT_LIMIT?: number

      REGION?: string
      ACCESS_KEY?: string
      SECRET_ACCESS_KEY?: string

      USER_POOL_ID?: string
      USER_POOL_WEB_CLIENT_ID?: string

      MAIL_FROM?: string
      MAIL_HOST?: string
      MAIL_PASSWORD?: string
      MAIL_USER?: string

      S3_BUCKET_NAME?: string
    }
  }
}
declare module 'express' {
  export interface Request {
    userId?: string
    userRole?: UserRoles
    accessToken?: string
    refreshToken?: string
    userEmail?: string
  }
}

export interface ModelResponse<T> {
  ok: boolean
  code: number
  message: string
  data: T
  statusCode?: string
}

export interface ModelRequest extends Request {
  user: {
    id: string
    role: UserRoles
  }
}
