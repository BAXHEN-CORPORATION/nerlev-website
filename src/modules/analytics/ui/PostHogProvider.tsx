'use client'

import { Suspense, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'
import { publicEnv } from '@/shared/infrastructure/env/env.client'

// spec §27: comportamental (pageviews, funis, UTMs) vai pro PostHog — dado crítico
// (sessão/lead/clique) já vive no Postgres próprio desde T2-T5, independente disso.
// No-op quando a env var não existe — nunca quebra o app por falta de key.

let initialized = false

function ensureInitialized() {
  if (initialized || !publicEnv.NEXT_PUBLIC_POSTHOG_KEY) return
  posthog.init(publicEnv.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: publicEnv.NEXT_PUBLIC_POSTHOG_HOST,
    // App Router não tem pageview automático como o Pages Router antigo — trackeamos
    // manualmente abaixo, em PostHogPageView.
    capture_pageview: false,
  })
  initialized = true
}

// Isolado num componente próprio: `useSearchParams()` exige um boundary de Suspense e
// força só ESSE subtree a renderizar dinamicamente — se estivesse no Provider teria
// arrastado toda a árvore (`children`) pra dynamic, quebrando o SSG do Home/livros (T1).
function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    ensureInitialized()
    if (!publicEnv.NEXT_PUBLIC_POSTHOG_KEY) return

    const query = searchParams.toString()
    posthog.capture('$pageview', {
      $current_url: query ? `${pathname}?${query}` : pathname,
    })
  }, [pathname, searchParams])

  return null
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </>
  )
}
