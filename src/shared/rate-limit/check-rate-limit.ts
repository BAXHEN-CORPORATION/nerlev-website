import 'server-only'
import { createServiceRoleSupabaseClient } from '@/shared/infrastructure/supabase/client'
import { getClientIp } from './get-client-ip'

export class RateLimitExceededError extends Error {
  constructor(action: string) {
    super(`Rate limit exceeded for ${action}.`)
    this.name = 'RateLimitExceededError'
  }
}

/** Throws RateLimitExceededError if the caller (by IP) has exceeded `limit` hits for
 * `action` within `windowSeconds`. Fails open on infra errors — an outage on this
 * bookkeeping table must never block the primary action (same best-effort principle as
 * email sending / click logging elsewhere in this codebase). */
export async function assertWithinRateLimit(
  action: string,
  { limit, windowSeconds }: { limit: number; windowSeconds: number },
): Promise<void> {
  const ip = await getClientIp()
  const bucketKey = `${action}:${ip}`

  let data: boolean | null
  try {
    const result = await createServiceRoleSupabaseClient().rpc('rate_limit_hit', {
      p_key: bucketKey,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    })
    if (result.error) {
      console.error(`Rate limit check failed for ${action}, failing open:`, result.error)
      return
    }
    data = result.data
  } catch (error) {
    // Client creation itself can throw (e.g. missing env) — must not take down the
    // primary action either, same fail-open guarantee as an RPC error.
    console.error(`Rate limit check failed for ${action}, failing open:`, error)
    return
  }

  if (data === false) {
    throw new RateLimitExceededError(action)
  }
}
