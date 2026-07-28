import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
export const env = createEnv({
  server: {
    MONGODB_URI: z.string().min(1),
    JWT_SECRET: z.string().min(1),
  },
  runtimeEnv: {
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
  },
});
