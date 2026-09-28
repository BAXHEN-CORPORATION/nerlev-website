import type { LocalizedText, ThemeId } from '@/shared/domain'

/** Points this option contributes to each theme when picked (spec §9: "Resposta A → fear+2, patience+1"). */
export type ThemeDeltas = Partial<Record<ThemeId, number>>

export interface QuestionOption {
  id: string
  label: LocalizedText
  /** Empty for purely demographic options (e.g. age bands) — no theme signal. */
  deltas: ThemeDeltas
}

export interface Question {
  id: string
  prompt: LocalizedText
  /** Age questions don't feed scoring; behavioral/preference questions do. */
  kind: 'demographic' | 'behavioral' | 'preference'
  options: QuestionOption[]
}
