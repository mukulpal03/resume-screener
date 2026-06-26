import 'dotenv/config';
import { z } from 'zod';

const envSchema = z
  .object({
    PORT: z.coerce.number().default(3000),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    FRONTEND_URL: z.string().default('http://localhost:5173'),
    REDIS_URL: z.string().default('redis://localhost:6379'),
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
    CLERK_PUBLISHABLE_KEY: z.string().min(1, 'CLERK_PUBLISHABLE_KEY is required'),
    CLERK_SECRET_KEY: z.string().min(1, 'CLERK_SECRET_KEY is required'),
    CLERK_WEBHOOK_SECRET: z.string().min(1, 'CLERK_WEBHOOK_SECRET is required'),
    LLM_PROVIDER: z.enum(['openai', 'gemini']).default('openai'),
    OPENAI_API_KEY: z.string().optional(),
    OPENAI_MODEL: z.string().default('gpt-4o-mini'),
    GOOGLE_API_KEY: z.string().optional(),
    GOOGLE_MODEL: z.string().default('gemini-2.5-flash'),
  })
  .refine(
    (data) => {
      if (data.LLM_PROVIDER === 'openai' && !data.OPENAI_API_KEY) {
        return false;
      }
      return true;
    },
    {
      message: 'OPENAI_API_KEY is required when LLM_PROVIDER is openai',
      path: ['OPENAI_API_KEY'],
    }
  )
  .refine(
    (data) => {
      if (data.LLM_PROVIDER === 'gemini' && !data.GOOGLE_API_KEY) {
        return false;
      }
      return true;
    },
    {
      message: 'GOOGLE_API_KEY is required when LLM_PROVIDER is gemini',
      path: ['GOOGLE_API_KEY'],
    }
  );

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(JSON.stringify(parsed.error.format(), null, 2));
  process.exit(1);
}

export const env = parsed.data;
