/**
 * A typing script: the keystrokes someone would actually make, including the mistakes.
 *
 * Backspacing only works from the end, which is the real constraint — it means a typo has
 * to be caught immediately or the whole tail after it gets retyped, exactly as when you
 * really notice one.
 */
export type TypingStep = { type: string } | { delete: number } | { pause: number }

export const isType = (step: TypingStep): step is { type: string } => 'type' in step
export const isDelete = (step: TypingStep): step is { delete: number } => 'delete' in step

/**
 * Plays a script through to its end and returns the resulting text.
 *
 * Used by the tests: hand-counted backspaces drift the moment the copy is edited, so the
 * script's final text is asserted rather than trusted.
 */
export function composeScript(script: TypingStep[]): string {
  let text = ''
  for (const step of script) {
    if (isType(step)) text += step.type
    else if (isDelete(step)) text = text.slice(0, Math.max(0, text.length - step.delete))
  }
  return text
}

/**
 * The longest the text ever gets while the script plays.
 *
 * Not the same as the settled text, and that difference is the whole point: a script that
 * types a sentence out and then takes it back is longer in the middle than at the end. The
 * box has to be reserved for the widest moment, or the header grows when the second
 * thoughts arrive and shrinks again when they go.
 */
export function longestScriptText(script: TypingStep[]): string {
  let text = ''
  let longest = ''
  for (const step of script) {
    if (isType(step)) text += step.type
    else if (isDelete(step)) text = text.slice(0, Math.max(0, text.length - step.delete))
    if (text.length > longest.length) longest = text
  }
  return longest
}
