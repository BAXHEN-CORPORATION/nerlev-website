// Composition root do modulo attribution — mesmo padrao dos outros modulos (actions.ts
// na raiz, unico lugar que conhece application + infrastructure). Sem 'use server': quem
// chama isso e um Route Handler (ja server-only), nao um Client Component.

import type { AmazonClickInput } from './domain'
import { logAmazonClick as logAmazonClickUseCase } from './application'
import { createSupabaseAmazonClickRepository } from './infrastructure'

/** Best-effort: a redirect pra Amazon nunca pode falhar por causa de um erro no tracking. */
export async function logAmazonClickBestEffort(input: AmazonClickInput) {
  try {
    await logAmazonClickUseCase(createSupabaseAmazonClickRepository(), input)
  } catch (error) {
    // Log the error only, never `input` (spec §29: "logs sem feedback sensível").
    console.error('Failed to log Amazon click:', error)
  }
}
