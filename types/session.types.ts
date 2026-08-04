export interface CreateSessionData {
    sessionId:string,
    userId:string,
    refreshTokenHash:string,
    userAgent?:string,
    expiresAt:Date
}


export interface SessionMetadata{
    userAgent:string
}
