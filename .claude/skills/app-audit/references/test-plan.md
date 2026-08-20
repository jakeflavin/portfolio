# Where findings cluster

A shipped app is usually well-tested along the path its author walks. Findings
collect in the states nobody had a reason to visit twice. Work through these while
planning — each one is a question to answer with the running app, not a box to tick.

## The states nobody designed

**Empty.** Every list, shelf, library and history has a zero state. Reach it two
ways if you can: a genuinely fresh visitor, and someone who emptied it. The copy is
usually written for the first and shown to both, which is how you get "nothing saved
yet" on a screen someone reached by deleting their last save. Check that an empty
screen offers a way onward and doesn't strand the user.

**Full / long.** The list with forty items, the name with fifty characters, the
title that wraps to three lines. Look for clipped text, broken alignment across a
row, and layouts that assumed one line.

**Error and malformed input.** Break the deep link. Truncate the share payload.
Pass an ID that doesn't exist. Silent fallback to the home screen is common and is
worth reporting: the user knows a friend sent them something and doesn't know why
they're looking at a menu.

**Second visit.** Reload mid-task. Does the draft survive? Does the app say so?
Does restored state look restored or just look odd?

**Back.** Press the browser's Back button from the deepest screen. Single-page apps
that keep all views on one URL walk the user out of the app entirely — this is one
of the most common and most severe findings in the set, and it's invisible unless
you actually press it. Related: are individual views linkable at all?

**Dark.** Not just "does it switch". Look at every illustration, icon, cover and
chart. Themes are usually applied at the token layer and then never looked at, and
artwork that relies on a light ground is where they break. Also check the OS-dark
default, not only the in-app toggle.

**Print.** If the content is readable, someone will print it. Chrome hidden? Measure
sane? Colour preserved or dropped deliberately? Test at page width — a wide-viewport
print emulation misleads.

**Keyboard.** Tab through a whole screen. Is focus always visible, and visible
*against what it lands on* — a focus ring the same colour as the element's own
border is technically present and practically useless. Does tab order follow the
visual order? Can you reach and operate every control?

**Reduced motion.** If the app animates, check it honours the preference.

## What passes a measurement and still looks wrong

These four all shipped past a clean automated run and were found in a minute by
somebody holding a phone. They are cheap to check and easy to miss.

**Scroll position after navigating.** A single-page app that swaps views without
touching scroll leaves the new screen at the old one's offset. Scroll down a list,
open the fifth item, and see where you land — the bug only appears if you had to
scroll to reach the thing you tapped, which is exactly what nobody does when
testing. Assert `window.scrollY === 0` after the transition.

**The narrowest width you actually support, not the popular one.** 390 is not the
floor; 320 still exists, and container overflow appears there first. A grid item's
automatic minimum size is `min-content`, so a row whose widest unbreakable part
exceeds the column pushes straight through its container's border while every
`scrollWidth` check on the document still reports zero overflow — the page doesn't
scroll sideways, the content just escapes its box. Measure children against their
*container's* box, not the viewport.

**Whatever a fixed bar is covering.** A fixed header or action bar sits over the
content rather than after it. Scroll to the very bottom and compare the last item's
`bottom` against the bar's `top`. The middle of a long form always looks fine.

Reaching the end of the page is only half of it: check **focus** too. Clicking a field
the bar is sitting on top of scrolls nothing, because the browser counts a field under
an overlay as visible — so people type into something they cannot see. Scroll until a
field straddles the bar's top edge, click it, and check whether anything moved.

Beware that your own tooling hides this one. Playwright scrolls an element into view
before clicking it, so `locator.click()` fixes the bug on the way to reproducing it —
a check written that way passes with the fix reverted. Scroll by hand with
`page.evaluate` and click with `page.mouse.click(x, y)` instead. Whenever a check is
meant to catch something specific, revert the fix once and confirm it actually fails;
a check that has never failed has never been tested either.

**Controls in both label states.** A button whose text changes — Clear/Undo,
Play/Pause, Follow/Following — changes width with it. If the row was sized to the
short label, the long one reflows or overflows it the moment it's pressed. Press it
and re-measure rather than trusting the initial render.

## Controls worth pressing specifically

- **Destructive ones.** Clear, delete, reset, remove. Is there a confirmation, an
  undo, or neither? Is the irreversible control the loudest or the quietest thing
  on the bar? Does it destroy persisted state as well as screen state?
- **Disabled ones.** Does disabled *look* disabled, and consistently across the
  screen? A control that reads as active and does nothing is worse than one that
  reads as unavailable.
- **Icon-only ones.** Count them per screen. Two similar glyphs side by side is a
  finding. Note when labels drop at a breakpoint and leave a row of unlabelled
  icons. Check whether app settings are mixed in with document actions.
- **Ones that only appear on hover.** They don't exist on touch, or they exist
  permanently and were never sized for a finger. Check both.
- **Share, copy, export.** Follow the output somewhere else and open it. A share
  link should be tested by actually loading it in a clean context.

## Measurements to take

| What | Threshold | How |
|---|---|---|
| Text contrast | 4.5:1 normal, 3:1 large (≥18.66px bold / ≥24px) | Compute from the shipped tokens, not by eye |
| Tap targets | 44×44 minimum on touch | Live `getBoundingClientRect()`, never estimated |
| Fixed bars / headers | Report as % of viewport height on mobile | Measured height ÷ `innerHeight` |
| Horizontal overflow | 0 | `scrollWidth - clientWidth` at every viewport |
| Console + page errors | 0 | Collect across the whole journey, not one page load |
| Content vs its container | inside the border | Compare children's rects to the container's, not the viewport's |
| Content vs a fixed bar | no overlap at full scroll | Last item's `bottom` vs the bar's `top` |
| Scroll after navigation | 0 | `window.scrollY` once the new view has painted |
| Input font size | ≥16px, or iOS zooms on focus | Computed style |

## Entry path, when in scope

- How many actions from the directory to a usable app screen?
- Is the affordance that opens it big enough to hit on a phone? Measure it.
- New tab or same tab? Either is defensible; note which, since it determines
  whether the app needs its own way back.
- Is there a route back to the directory from inside the app?
- Does the name in the directory match the URL it opens?
