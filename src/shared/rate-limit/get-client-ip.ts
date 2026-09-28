import 'server-only'
import { headers } from 'next/headers'

/** Best-effort client IP for rate-limit bucketing. Netlify sets x-nf-client-connection-ip
 * from the actual connection (not spoofable by the client) — prefer it over
 * x-forwarded-for, which a client can set arbitrarily. */
export async function getClientIp(): Promise<string> {
  const headerList = await headers()
  const nfIp = headerList.get('x-nf-client-connection-ip')
  if (nfIp) return nfIp

  const forwardedFor = headerList.get('x-forwarded-for')
  if (forwardedFor) return forwardedFor.split(',')[0]?.trim() ?? 'unknown'

  return 'unknown'
}
