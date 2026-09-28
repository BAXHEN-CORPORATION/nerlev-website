import { describe, expect, it } from 'vitest'
import { parseAttribution } from '@/shared/attribution/parse-attribution'

describe('parseAttribution', () => {
  it('reads all four UTM params and the referrer', () => {
    const result = parseAttribution(
      {
        utm_source: 'youtube',
        utm_medium: 'short',
        utm_campaign: 'fear',
        utm_content: 'CUT000142',
      },
      'https://youtube.com/watch?v=abc',
    )

    expect(result).toEqual({
      utmSource: 'youtube',
      utmMedium: 'short',
      utmCampaign: 'fear',
      utmContent: 'CUT000142',
      referrer: 'https://youtube.com/watch?v=abc',
    })
  })

  it('takes the first value when a param repeats in the query string', () => {
    const result = parseAttribution({ utm_source: ['youtube', 'instagram'] }, null)
    expect(result.utmSource).toBe('youtube')
  })

  it('leaves everything undefined for a bare landing URL with no UTMs or referrer', () => {
    const result = parseAttribution({}, null)
    expect(result).toEqual({
      utmSource: undefined,
      utmMedium: undefined,
      utmCampaign: undefined,
      utmContent: undefined,
      referrer: undefined,
    })
  })
})
