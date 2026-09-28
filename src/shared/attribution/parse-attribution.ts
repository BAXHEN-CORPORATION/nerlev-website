export interface Attribution {
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  referrer?: string
}

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

/** spec §25: reads UTMs from the landing URL's query string. */
export function parseAttribution(
  searchParams: Record<string, string | string[] | undefined>,
  referrer: string | null,
): Attribution {
  return {
    utmSource: firstValue(searchParams.utm_source),
    utmMedium: firstValue(searchParams.utm_medium),
    utmCampaign: firstValue(searchParams.utm_campaign),
    utmContent: firstValue(searchParams.utm_content),
    referrer: referrer ?? undefined,
  }
}
