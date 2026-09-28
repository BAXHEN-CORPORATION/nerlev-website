import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { getTranslations } from 'next-intl/server'
import { isValidLocale, routing } from '@/lib/i18n/routing'

export const alt = 'NerLev'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const iconData = await readFile(join(process.cwd(), 'public/brand/nerlev-icon.png'), 'base64')
const iconSrc = `data:image/png;base64,${iconData}`

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const safeLocale = isValidLocale(locale) ? locale : routing.defaultLocale
  const t = await getTranslations({ locale: safeLocale, namespace: 'home' })

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 32,
          background: '#24334A',
        }}
      >
        <img src={iconSrc} width={160} height={160} />
        <div style={{ display: 'flex', fontSize: 72, fontWeight: 600, color: '#FFFDF9' }}>
          NerLev
        </div>
        <div style={{ display: 'flex', fontSize: 32, color: '#E5B95C' }}>{t('tagline')}</div>
      </div>
    ),
    { ...size },
  )
}
