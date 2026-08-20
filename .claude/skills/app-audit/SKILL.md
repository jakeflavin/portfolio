---
name: app-audit
description: Run a full usability and design audit of one app in the portfolio, driving it as a real user against the production URL at desktop, tablet and mobile, and produce an illustrated report Artifact where every finding — good and bad — carries a screenshot. Use this whenever the user asks to audit, review, evaluate, critique, QA, or "go through" one of the portfolio apps (Fable, Fibo, Hush, Hat, Linkit, Runify, Weather, Countdown, or a newly added one), asks how an app holds up on mobile or in dark mode, asks for a UX/design review of something they've shipped, or says it's the next app's turn. Also use it for a newly built app before it goes in the directory.
---

# App audit

You are auditing one shipped app the way a careful design lead would: by using it,
not by reading it. The code is background research; the findings come from the
running product at a real URL.

Two things make an audit worth reading. **Specificity** — "the primary button is
3.97:1" beats "check your contrast". And **fairness** — a report that only lists
faults tells the author nothing about what to protect while fixing them. Every
audit records what works, with evidence, alongside what doesn't.

## Before you start

Confirm three things with the user unless the conversation already settles them:

- **Which app**, and its production URL. Apps live at `<host>/<slug>/` — check
  `apps.json` for the slug, which may not match the title (Fable ships at `/madlib/`).
- **Scope**: the app alone, or the app plus the route into and out of it from the
  portfolio directory. Entry path is usually worth including — it's the first thing
  a real visitor meets — but audit the shell itself separately or findings blur.
- **Fix or report only.** Report-only keeps the audit honest and is the better
  default; the user triages, then fixes land in their own pass.

Ask about accessibility depth only if it's genuinely open. The useful default is
folding a11y into usability — contrast, target size, focus visibility, missing
labels — rather than a formal WCAG sweep.

## 1. Read the app, then write a plan

Read the source before touching the browser. You are looking for two things.

**The feature list**, so the plan covers what the app actually does rather than
what a generic checklist assumes. Trace the top-level component or router: how many
distinct views are there, what state does each have, what persists.

**The app's own stated intent** — `README.md`, `DESIGN.md`, a tokens file, comments
that explain a decision. This is the highest-yield reading you will do. An app that
documents its own rules gives you a standard to measure it against, and the
strongest findings in any audit are the places where the shipped product
contradicts the thing its author wrote down. Quote the document when it happens.

Then write the plan: every screen, every state, every control. Keep it in front of
you and work through it — the point of writing it down is that you don't quietly
skip the states that are tedious to reach.

`references/test-plan.md` lists the state classes that are usually unexercised and
therefore where findings cluster. Read it while planning.

## 2. Drive it

**Use Playwright, not the browser pane.** The pane's paint surface doesn't honour
custom viewport sizes, and its screenshots don't land on disk — and you need files
on disk for the report. Reserve the pane for a quick look at something odd.

Playwright is a devDependency of the portfolio repo. Scripts import it by absolute
path from `<repo>/node_modules/playwright/index.mjs`; `scripts/journey.mjs` shows
the pattern. Work in your scratchpad directory, not the user's project.

Three viewports, every one of them a full journey rather than a screenshot:

| | | |
|---|---|---|
| desktop | 1440×900 | |
| tablet | 820×1180 | |
| mobile | 390×844 | use Playwright's `devices['iPhone 13']` so `hover: none` and touch resolve correctly — several affordances change under it |
| narrow | 320×700 | the floor. Container overflow shows up here and nowhere else |

Two scripts do the work:

- **`scripts/probe.mjs <url>`** — a generic pass that needs no knowledge of the app.
  Console and page errors, horizontal overflow, every interactive element under the
  44px target minimum, the computed colour tokens, measured contrast for the text
  actually rendered, and screenshots in light, dark, print and reduced-motion. Run
  it first; it hands you a list of things to go look at.
- **`scripts/journey.mjs`** — a template to copy into your scratchpad and rewrite
  for this app's flows. It wraps each step so one broken step doesn't abort the run,
  names screenshots consistently, and writes measurements to JSON.

Drive the real journey: open the thing, type into it, submit it, break it, come
back to it, reload, share it, print it. A control you never pressed is a control
you didn't audit.

**Measure rather than estimate.** Numbers are what make a finding actionable and
hard to wave away. Contrast from the shipped tokens, target sizes from live bounding
boxes, a fixed bar as a percentage of the viewport it eats. When you assert
something is too small or too low-contrast, the number should be in the sentence.

**A measurement passing is not the same as the screen being right.** Automated checks
confirm the values you thought to ask about; they say nothing about the ones you
didn't. Between steps, actually look at the screenshot — and take one at the *end* of
a long page and at your narrowest supported width, not just at the top of a 390px
phone. The four worst bugs in the first Fable audit's follow-up all survived a clean
30-check run and were obvious to a person holding a device.

**Distinguish what you saw from what the method did.** Emulated print media, for
instance, doesn't apply page margins — so an edge-to-edge print screenshot may be an
artifact of the harness, not the app. Re-test at a page-width viewport before
calling it. Say so in the report when a result is method-limited.

## 3. Judge it

Usability and design are one pass, not two. While you work through the flows, ask:

- Is the copy saying a true thing, in words the user would use? Empty states and
  error messages are where copy goes wrong most often — they get written once, for
  a situation the author never actually reached.
- Does the same idea look the same everywhere? Same control, same weight; same
  state, same treatment. Inconsistency reads as inattention even when each instance
  is individually fine.
- Is the visual weight pointing at the right thing? The irreversible action should
  not be the quietest control on the bar.
- Does it look decided, or defaulted? Ragged alignment, orphaned elements, a screen
  built from another screen's parts.
- What happens on the second visit, the shared link, the small screen, the dark
  room, the keyboard?

Severity is about consequence, not effort:

- **High** — breaks a flow, loses work, fails an accessibility floor, or is the
  first thing a stranger sees.
- **Medium** — costs time, confidence, or a second attempt.
- **Low** — polish, inconsistency, copy.

## 4. Report it

Publish an Artifact. `references/report.md` has the structure, the severity rubric,
and guidance on writing findings that stay useful — read it before you start
writing.

Two rules that carry the whole report:

**Every finding gets a screenshot**, good and bad alike. Reuse an image across
findings when it genuinely shows both. A before/after pair — light beside dark,
broken beside working — makes some findings self-evident in a way prose cannot.

**Derive the report's palette from the app you are auditing.** `assets/report-template.html`
is a proof-sheet layout with a token block at the top. Replace those tokens with the
audited app's own colours: its paper, its ink, its accents driving the severity
scale. A Fable audit should look like a Fable proof; a Hush audit should not look the
same. The structure is shared; the identity is borrowed from the subject. Load the
`artifact-design` skill before writing, as always.

`scripts/build_report.py` handles the image pipeline — downscales the PNGs, converts
to JPEG, inlines them as data URIs and reports the final size. Artifacts cap at 16MB
and must be self-contained; twenty images at 1100px wide lands around 3MB.

## 5. Close it out

Tell the user in chat what the five worst things are, in a few sentences, and hand
over the link. Don't recite the report — they're about to read it.

If findings are worth remembering across sessions — a decision the user made about a
flagged issue, a constraint that explains something you'd otherwise re-flag next
time — write it to memory. Don't record the findings themselves; the report holds
those, and they'll be stale after the next deploy.
