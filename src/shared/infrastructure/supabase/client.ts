import 'server-only'
import { createClient } from '@supabase/supabase-js'
import { publicEnv } from '../env/env.client'
import { serverEnv } from '../env/env.server'

// Every client here is scoped to the `nerlev` schema — this project shares its
// Supabase instance with another app, and `public` belongs to that other app
// (see ADR-003). Never override `db.schema` away from 'nerlev'.

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing ${name} — set it in .env.local before creating a Supabase client (see .env.local.example).`,
    )
  }
  return value
}

/** Anon-key client for server-side reads/writes under RLS. No auth/session handling yet — the MVP has no parent login (spec §43), only anonymous quiz sessions. */
export function createServerSupabaseClient() {
  const url = requireEnv('NEXT_PUBLIC_SUPABASE_URL', publicEnv.NEXT_PUBLIC_SUPABASE_URL)
  const anonKey = requireEnv(
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  )

  return createClient(url, anonKey, { db: { schema: 'nerlev' } })
}

/** Service-role client that bypasses RLS. Server-only, use sparingly (e.g. trusted background jobs). */
export function createServiceRoleSupabaseClient() {
  const url = requireEnv('NEXT_PUBLIC_SUPABASE_URL', publicEnv.NEXT_PUBLIC_SUPABASE_URL)
  const serviceRoleKey = requireEnv(
    'SUPABASE_SERVICE_ROLE_KEY',
    serverEnv.SUPABASE_SERVICE_ROLE_KEY,
  )

  return createClient(url, serviceRoleKey, { db: { schema: 'nerlev' } })
}
