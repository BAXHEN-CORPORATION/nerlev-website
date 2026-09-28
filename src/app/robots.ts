import type { MetadataRoute } from 'next'
import { siteUrl } from '@/shared/seo/site-url'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/resultado',
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  }
}
