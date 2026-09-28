import 'server-only'
import { createServerSupabaseClient } from '@/shared/infrastructure/supabase/client'
import type { AmazonClickInput } from '../domain'
import type { AmazonClickRepository } from '../application/amazon-click-repository'

export function createSupabaseAmazonClickRepository(): AmazonClickRepository {
  const supabase = createServerSupabaseClient()

  return {
    async logClick(input: AmazonClickInput) {
      const { error } = await supabase.from('amazon_clicks').insert({
        book_code: input.bookCode,
        session_id: input.sessionId,
        utm_source: input.utmSource,
        utm_medium: input.utmMedium,
        utm_campaign: input.utmCampaign,
        utm_content: input.utmContent,
      })
      if (error) throw new Error(`Failed to log Amazon click: ${error.message}`)
    },
  }
}
