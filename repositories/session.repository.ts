import { Session } from "@/models/Session.models";
import type { CreateSessionData } from "@/types/session.types";

export async function createSession(data: CreateSessionData) {
  return Session.create(data);
}
export async function findActiveSessionById(sessionId: string) {
  return Session.findOne({
    sessionId,
    revokedAt: null,
    expiresAt: {
      $gt: new Date(),
    },
  }).select("+refreshTokenHash");
}

export async function rotateSessionRefreshToken(
  sessionId: string,
  currentTokenHash: string,
  newTokenHash: string,
  newExpiresAt: Date
) {
  return Session.findOneAndUpdate(
    {
      sessionId,
      refreshTokenHash: currentTokenHash,
      revokedAt: null,
      expiresAt: {
        $gt: new Date(),
      },
    },
    {
      $set: {
        refreshTokenHash: newTokenHash,
        lastUsedAt: new Date(),
        expiresAt: newExpiresAt,
      },
    },
    {
      new: true,
    }
  );
}

export async function revokeSessionById(sessionId: string) {
  return Session.findOneAndUpdate(
    {
      sessionId,
      revokedAt: null,
    },
    {
      $set: {
        revokedAt: new Date(),
      },
    },
    {
      new: true,
    }
  );
}
// Used when a user removes another logged-in device.
// Both ownership and session identity must match.
export async function revokeUserSessionById(
  userId: string,
  sessionId: string
) {
  return Session.findOneAndUpdate(
    {
      userId,
      sessionId,
      revokedAt: null,
      expiresAt: {
        $gt: new Date(),
      },
    },
    {
      $set: {
        revokedAt: new Date(),
      },
    },
    {
      new: true,
    }
  );
}
export async function  findActiveSessionsByUserId (userId:string){

  return Session.find({
    userId,revokedAt:null,expiresAt:{
      $gt:new Date(),
    }

  }).select('sessionId userAgent  lastUsedAt  expiresAt  createdAt -_id ').sort({lastUsedAt:-1}).lean()


}
