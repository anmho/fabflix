const zod = require("zod");
const z = zod;

const envSchema = z.object({
  NODE_ENV: z.string(),
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: z.string(),
});

const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
});

module.exports = { env };
