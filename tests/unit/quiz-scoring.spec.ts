import { describe, expect, it } from 'vitest'
import { ScoringV1 } from '@/modules/quiz/definitions/v1'

describe('ScoringV1', () => {
  it('scores fear as primary when the fear-related answers dominate', () => {
    const result = ScoringV1.calculate([
      { questionId: 'q1-age', optionId: 'age-5-7' },
      { questionId: 'q2-fear-reaction', optionId: 'fear-cry-cling' }, // fear+2
      { questionId: 'q6-waiting-reaction', optionId: 'wait-negotiate' }, // patience+1, truth+1
    ])

    expect(result.primaryThemeId).toBe('fear')
    expect(result.themeScores.find((t) => t.themeId === 'fear')?.score).toBe(2)
  })

  it('lets an explicit Q7 preference pick dominate over weaker behavioral signals', () => {
    const result = ScoringV1.calculate([
      { questionId: 'q3-wanting-reaction', optionId: 'want-persist' }, // desire+2, patience+1
      { questionId: 'q7-preference', optionId: 'prefer-forgiveness' }, // forgiveness+3
    ])

    expect(result.primaryThemeId).toBe('forgiveness')
    expect(result.secondaryThemeId).toBe('desire')
  })

  it('sums deltas across multiple answers pointing at the same theme', () => {
    const result = ScoringV1.calculate([
      { questionId: 'q4-sharing-reaction', optionId: 'share-jealous' }, // jealousy+2, conflict+1
      { questionId: 'q7-preference', optionId: 'prefer-jealousy' }, // jealousy+3
    ])

    expect(result.primaryThemeId).toBe('jealousy')
    expect(result.themeScores.find((t) => t.themeId === 'jealousy')?.score).toBe(5)
  })

  it('returns null primary/secondary and no theme scores for an empty/zero-signal answer set', () => {
    const result = ScoringV1.calculate([
      { questionId: 'q1-age', optionId: 'age-2-4' },
      { questionId: 'q6-waiting-reaction', optionId: 'wait-accept' }, // no deltas
    ])

    expect(result.primaryThemeId).toBeNull()
    expect(result.secondaryThemeId).toBeNull()
    expect(result.themeScores).toEqual([])
  })

  it('ignores answers referencing an unknown question or option (defensive)', () => {
    const result = ScoringV1.calculate([
      { questionId: 'does-not-exist', optionId: 'nope' },
      { questionId: 'q2-fear-reaction', optionId: 'also-nope' },
    ])

    expect(result.primaryThemeId).toBeNull()
    expect(result.themeScores).toEqual([])
  })

  it('is deterministic for the same input', () => {
    const answers = [
      { questionId: 'q5-mistake-reaction', optionId: 'mistake-hide' }, // guilt+2, fear+1
    ]
    const first = ScoringV1.calculate(answers)
    const second = ScoringV1.calculate(answers)
    expect(second).toEqual(first)
  })
})
