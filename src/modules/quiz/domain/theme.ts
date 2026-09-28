import type { LocalizedText, ThemeId } from '@/shared/domain'

export type { ThemeId } from '@/shared/domain'

export interface Theme {
  id: ThemeId
  label: LocalizedText
  /** Short, non-clinical explanation of why this theme showed up (spec §3.5). */
  explanation: LocalizedText
  /** 2-3 practical tips for parents (spec §12). */
  tips: LocalizedText[]
}
