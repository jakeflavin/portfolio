# Where code goes

Every repo in this set uses the same `src/` layout. The point is that moving between them
costs nothing: the same kind of file is always in the same place, so finding something
never depends on remembering which app you are in.

```
src/
  App.tsx          the app itself
  main.tsx         the bootstrap
  index.css        reset and design tokens
  components/      anything that renders
  hooks/           anything starting with use
  lib/             everything else — pure logic, no React
  api/             HTTP clients, when the app talks to a network
```

## The rule

A file named `useSomething` is a hook and lives in `hooks/`. A file that renders is a
component and lives in `components/`. Everything else is `lib/`. That is the whole rule,
and it is deliberately mechanical — a layout you have to think about is one that drifts.

`App.tsx`, `main.tsx` and the stylesheet stay at the root of `src/`, because they are the
entry points rather than members of a category.

## Tests

Tests sit beside what they cover — `lib/units.ts` and `lib/units.test.ts` in the same
folder. Nothing collects them into a separate tree.

## Component-private files stay with the component

A hook or a helper used by exactly one component belongs to that component, not to
`hooks/` or `lib/`:

```
components/Select/
  Select.tsx
  Select.styled.ts
  select.utils.ts     used only by Select
  useSelect.ts        used only by Select
  index.ts
```

`hooks/` and `lib/` are for things the app shares. The test is whether a second file
imports it — if not, it stays where it is used. This keeps the shared folders meaningful
rather than becoming a dumping ground.

## Domain folders are fine

An app with a body of its own data or content can name a folder for it — `data/` in linkit,
`tales/` in madlib, `pages/` in fibo. These are additions to the layout above, not
replacements for it.

## Why this shape

It was already the majority. Five of the eight apps had settled on `components/ hooks/ lib/`
without it being written down anywhere; three kept everything loose at the root of `src/`,
and the portfolio used a `features/` and `ui/` split of its own.

The flat layout was the real cost. countdown had seventeen modules at the root of `src/`,
roll had twenty-one — enough that finding anything meant knowing the filename first.

The portfolio's `features/` and `ui/` split was defensible on its own terms: `ui/` was a
component library and `features/` were page-level features, a distinction the single-screen
apps do not have. It was still a second thing to learn, and the decision was that one
layout everywhere is worth more than that distinction. Its component folders survive, since
grouping a component with its styles and its private helpers is what the rule above already
describes.
