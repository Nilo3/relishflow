import { Response } from 'express'

export const setCookie = (
  response: Response,
  name: string,
  value: string,
  maxAge: number = 7 * 24 * 60 * 60 * 1000
) => {
  response.cookie(name, value, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge
  })
}

export const removeCookie = (response: Response, name: string) => {
  response.clearCookie(name, {
    httpOnly: true,
    secure: true,
    sameSite: 'none'
  })
}
