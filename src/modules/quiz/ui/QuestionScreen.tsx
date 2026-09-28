import type { Question } from '../domain'
import type { Locale } from '@/lib/i18n/routing'

export function QuestionScreen({
  question,
  locale,
  disabled,
  onSelect,
}: {
  question: Question
  locale: Locale
  disabled: boolean
  onSelect: (optionId: string) => void
}) {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
      <p className="font-display text-deep-blue text-xl font-semibold sm:text-2xl">
        {question.prompt[locale]}
      </p>
      <div className="flex w-full flex-col gap-3">
        {question.options.map((option) => (
          <button
            key={option.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(option.id)}
            className="border-deep-blue/20 text-ink rounded-2xl border bg-white/60 px-5 py-3 text-left transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {option.label[locale]}
          </button>
        ))}
      </div>
    </div>
  )
}
