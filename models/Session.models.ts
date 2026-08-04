import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    refreshTokenHash: {
      type: String,
      required: true,
      select: false,
    },
    userAgent: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "unknown",
    },
    lastUsedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    revokedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);
// Automatically remove expired sessions
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Session =
  mongoose.models.Session || mongoose.model("Session", sessionSchema);

// userId: identifies the account.
// refreshTokenHash: stores the refresh token safely.
// userAgent: helps label the browser/device.
// lastUsedAt: shows recent session activity.
// expiresAt: controls session expiration.
// revokedAt: supports logout without immediately deleting the record.

// JWT + Session Store (your schema)

// Slightly more database work.
// Much better security and control.
// Supports logout from one device, logout from all devices, device lists, token rotation, and revocation
