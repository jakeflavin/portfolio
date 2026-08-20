import { describe, it, expect } from 'vitest'
import { composeScript, longestScriptText } from './typing'

describe('longestScriptText', () => {
  /**
   * A script that types a sentence and takes it back is longer in the middle than at the
   * end, and the box is reserved from this rather than from the settled text.
   */
  it('measures the widest moment, not the last one', () => {
    const script = [{ type: 'kept.' }, { type: ' taken back.' }, { delete: 12 }]
    expect(composeScript(script)).toBe('kept.')
    expect(longestScriptText(script)).toBe('kept. taken back.')
  })
})
