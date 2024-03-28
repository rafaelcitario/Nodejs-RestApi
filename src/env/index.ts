import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
  DATABASE_CLIENT: z.string(),
  DATABASE_URL: z.string(),
  MIGRATIONS_URL: z.string(),
  MIGRATIONS_EXT: z.string(),
  PORT: z
    .string()
    .transform((port) => parseInt(port))
    .default('3000'),
  HOST: z.enum(['localhost', '127.0.0.1']).default('localhost'),
})

export const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.log('Some enviroment variables is not found. ', _env.error.format())
  throw new Error('Some enviroment variables is not found. ')
}

export const env = _env.data
