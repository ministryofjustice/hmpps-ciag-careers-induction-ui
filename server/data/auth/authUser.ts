import { Expose } from 'class-transformer'
import PageableResponse from '../domain/types/pagedResponse'

export default class AuthUser {
  @Expose()
  username: string

  @Expose()
  authSource: string

  @Expose()
  active: boolean

  @Expose()
  name?: string

  @Expose()
  firstName?: string

  @Expose()
  lastName?: string

  @Expose()
  email?: string

  @Expose()
  userId?: string

  @Expose()
  uuid?: string
}

export type PagedAuthUserResponse = PageableResponse<AuthUser>
