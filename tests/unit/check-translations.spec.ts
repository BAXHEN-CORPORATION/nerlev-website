import { describe, expect, it } from 'vitest'
import { findMismatches } from '../../scripts/check-translations'

describe('translation messages', () => {
  it('have matching keys across pt/en/es', () => {
    expect(findMismatches()).toEqual([])
  })
})
