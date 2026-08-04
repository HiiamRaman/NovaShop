import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
export const env = createEnv({
  server: {
    MONGODB_URI: z.string().min(1),
    ACCESS_TOKEN_SECRET: z.string().min(64),
    ACCESS_TOKEN_EXPIRY: z.coerce.number().int().positive(),
    REFRESH_TOKEN_SECRET: z.string().min(64),
    REFRESH_TOKEN_EXPIRY: z.coerce.number().int().positive(),
  },
  runtimeEnv: {
    MONGODB_URI: process.env.MONGODB_URI,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
  },
});
