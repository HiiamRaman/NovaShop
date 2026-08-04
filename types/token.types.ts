export type UserRole = 'user' | 'admin'
export interface AccessTokenPayload {
    sub:string,
    sessionId:string,
    role:UserRole,
    tokenType:'access'
}


export interface RefreshTokenPayload {
    sub:string,
    sessionId:string,
    tokenType:'refresh'

}
