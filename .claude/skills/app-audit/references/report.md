# Writing the report

The report is the deliverable. It gets read once, carefully, by the person who
built the thing — so it needs to be specific enough to act on and fair enough to
be trusted.

## Structure

Use this shape. It front-loads the judgement, then evidences it.

1. **Masthead** — app name, the URL tested, the date, the viewports, and that it
   was the production build. Facts the reader needs to trust the rest.
2. **Verdict** — three or four paragraphs of plain assessment. Say what the app is
   trying to be and whether it succeeds. Name the pattern behind the worst findings
   rather than listing them; the list is below. End with how much of this actually
   matters.
3. **Tally** — counts by severity, including the commendations.
4. **What works** — before the faults, not after. Each item gets a screenshot and
   a paragraph saying what was done well and why it was hard. This is not padding:
   it tells the author what to protect while they fix the rest.
5. **Findings**, grouped by severity, highest first. Number them `F1…Fn` and keep
   the numbering continuous across groups so they can be referenced.
6. **How this was tested** — what was covered, the method, and honestly what was
   not covered. The limits belong in the report, not in a caveat you never wrote.

## A finding

Each one carries: an ID, a severity, the viewports it affects, the screens it lives
on, a title, the body, and at least one screenshot with a caption.

- **The title is the finding**, not a category. "The empty library says the one
  thing that cannot be true" tells the reader what happened; "Empty state issues"
  makes them read the paragraph to find out.
- **First paragraph: what happens**, concretely, with the numbers. What you did,
  what the app did.
- **Second paragraph: why it matters, or what causes it.** A structural cause is
  worth naming when you found one — "this grid is used elsewhere inside a wrapper
  that supplies the max-width, and here it isn't" turns a cosmetic complaint into
  a one-line fix. Consequence matters more than mechanism when you have to choose.
- **Suggest a fix only when it's short and you're confident.** A margin note in the
  auditor's voice is the right register for this. Don't design the solution in the
  report; you're not the one who has to live with it.
- Say when something is a **decision rather than a defect** — a trademark question,
  a deliberate tradeoff. Flag it, give the reasoning, and leave the call with the
  author.

## Severity

- **High** — breaks a flow, loses work, fails an accessibility floor, or is among
  the first things a stranger sees. Fix before showing it to anyone.
- **Medium** — costs time, confidence, or a second attempt. Worth doing next.
- **Low** — polish, inconsistency, copy. Listed because on considered work these
  are what's left.

Don't inflate. A report where everything is High is a report where nothing is.

## Tone

Write like a colleague who respects the work. Be direct about faults and generous
about what's good — both should read as the same person's honest opinion. Avoid
hedging ("might possibly be a bit confusing") and avoid scolding. Quote the app's
own documentation where the app contradicts it: that's the most persuasive form a
finding can take, because it's the author's standard, not yours.

## Screenshots

Every finding gets one. Some rules that make them work:

- **Pairs prove things prose can't.** Light beside dark, before beside after,
  desktop beside mobile. Use a two-column figure for these.
- **Caption with the fact**, in the utility face: what screen, what viewport, what
  to look at. "Row 1: the yellow panel runs deeper than the orange and blue · 820×1180".
- **Crop mobile shots narrow** rather than stretching them across the column.
- Reuse an image across findings when it honestly shows all of them — a single
  action-bar screenshot can evidence a contrast failure, an unprotected destructive
  control and a bad disabled state.

## Design of the report itself

Load the `artifact-design` skill first. Then:

`assets/report-template.html` is a proof-sheet layout — a hanging key column with
the finding ID, severity chip and viewport chips, and the body beside it. It's built
for this content: findings are a keyed list that gets referenced by number, so
numbering earns its place, and the severity chips encode state rather than
decorating it.

**Replace the token block with the audited app's palette.** The template ships with
neutral placeholders and a comment marking where. Take the app's own ground, ink and
accents from its CSS custom properties or design doc, and drive the severity scale
from its accent colours. The audit of each app should look like a proof sheet for
that app — same structure, different identity. Keep both themes working; the token
block is already set up for the three theme states.

Then run `scripts/build_report.py` to inline the images and check the size.
