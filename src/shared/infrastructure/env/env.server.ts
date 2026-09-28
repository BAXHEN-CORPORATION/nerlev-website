import 'server-only'
import { z } from 'zod'

const serverSchema = z.object({
  // Supabase — projeto compartilhado, schema `nerlev` isolado (ver ADR-003).
  SUPABASE_DB_URL: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  SUPABASE_PROJECT_REF: z.string().min(1).optional(),

  // Storage S3-compatible (Supabase Storage) — uso real em T1.
  S3_ENDPOINT: z.string().min(1).optional(),
  S3_REGION: z.string().min(1).optional(),
  S3_ACCESS_KEY_ID: z.string().min(1).optional(),
  S3_SECRET_ACCESS_KEY: z.string().min(1).optional(),
  S3_BUCKET: z.string().min(1).optional(),

  // Email (Resend) — uso real em T4.
  RESEND_API_KEY: z.string().min(1).optional(),
})

const parsed = serverSchema.safeParse(process.env)

if (!parsed.success) {
  throw new Error(`Invalid server environment variables: ${parsed.error.message}`)
}

/** Server-only secrets. Never import this module from a Client Component. */
export const serverEnv = parsed.data
