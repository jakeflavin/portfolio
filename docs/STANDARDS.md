# Coding standards

Mandatory rules for the directory and every app it publishes. Examples are generic; apply
the principle, not the literal snippet.

Where code goes is a separate document — see [LAYOUT.md](LAYOUT.md). How the repos build
and deploy is [BUILD.md](BUILD.md).

## Toolchain

One version of everything, everywhere. A repo that disagrees is a bug, not a preference.

| | |
|---|---|
| Node | 22, pinned in CI and declared in `engines` |
| React | 19 |
| Build | Vite 8 with `@vitejs/plugin-react` |
| Language | TypeScript 6, `strict` and `noUncheckedIndexedAccess` both on |
| Tests | Vitest, with Testing Library and jsdom where components are tested |
| Lint | oxlint, one shared `.oxlintrc.json` |
| Format | Prettier: single quotes, no semicolons, `printWidth: 100` |
| Icons | `lucide-react` |

## TypeScript

- **`strict` and `noUncheckedIndexedAccess` are on.** An indexed read is a maybe. Guard the
  value you actually read rather than a length or bounds test beside it — the compiler
  cannot connect the two, and neither can a reader:

  ```ts
  // Bad: the check and the use are different expressions
  if (index < points.length) use(points[index].time)

  // Good: the value is the check
  const point = points[index]
  if (point) use(point.time)
  ```

- **`interface` for object shapes**, `type` for unions, intersections and function types.
- **No `any`.** No `!` outside a boundary you have just proven narrow.
- **A list that is never empty says so**: `[Gradient, ...Gradient[]]` beats asserting its
  first element at every use.
- **`@/` imports** for anything outside the current folder; relative paths for siblings.

## Components

- **`export function Name()`**, named exports, no `React.FC` and no default exports for
  components.
- **Declare a `NameProps` type** rather than inlining the object in the signature.
- **Handlers are `onSomething`** on props, `handleSomething` for local definitions.
- A component's private helpers and hooks live beside it, not in the shared folders — see
  [LAYOUT.md](LAYOUT.md).

## SOLID

### Single responsibility

One reason to change per module. Components render; hooks hold stateful logic; `lib/` holds
pure rules and the code that talks to the outside world.

```tsx
// Bad: fetching, business rules, and two UIs in one component
function Panel() {
  const [rows, setRows] = useState<Row[]>([])
  useEffect(() => { fetch('/rows').then(r => r.json()).then(setRows) }, [])
  const winner = rows.reduce(/* 30 lines of scoring */)
  return <>{/* table markup */}{/* summary markup */}</>
}

// Good: a hook, a pure rule, one component per UI
function Panel() {
  const rows = useRows()
  return (<><RowTable rows={rows} /><Summary winner={computeWinner(rows)} /></>)
}
```

Don't: mix data access into components; put rendering into `lib/`; grow a component past
one screenful before splitting.

### Open/closed

Extend by adding data or a new implementation, not by editing every consumer. Decks, roles,
themes and colour ramps are declared once and consumed generically.

```tsx
// Bad: every new value edits this component
{v === 'coffee' ? <Coffee /> : v === 'skip' ? '?' : v === 21 ? '21' : …}

// Good: one renderer owns the mapping
<VoteGlyph value={v} />
```

Don't: switch on a type field in many places — add the case to the one table that owns it.

### Liskov substitution

Anything accepting an interface must work with every implementation of it. A variant
component takes the same props and honors all of them.

```tsx
// Bad: the compact variant silently ignores onSelect
function CompactRow({ story, onSelect }: RowProps) {
  return <li>{story.title}</li> // onSelect dropped — callers can't swap variants
}

// Good: both variants honor the full contract
function CompactRow({ story, onSelect }: RowProps) {
  return <li onClick={() => onSelect(story.id)}>{story.title}</li>
}
```

Don't: throw on inputs a sibling accepts; narrow a prop's accepted values in an override;
return a different shape than the base promises.

### Interface segregation

Take only what you use. Small prop types, small function signatures.

```tsx
// Bad: forces every caller to have the whole world
function TitleRow({ session, users, settings }: Everything) { … }

// Good: minimal surface
function TitleRow({ title, canEdit, onRename }: TitleRowProps) { … }
```

Don't: pass a whole record where one field will do; export one giant "utils" interface; add
a prop "for later".

### Dependency inversion

Depend on abstractions. UI calls named functions from `lib/` — never the database or the
network directly.

```tsx
// Bad: component knows the database layout
onClick={() => set(ref(db, `sessions/${id}/stories/${sid}/result`), v)}

// Good: component knows the intent
onClick={() => setResult(session.id, story.id, v)}
```

Don't: import a database or HTTP client outside `lib/` and `api/`; reach into
`import.meta.env` outside one config module.

## React

Do:

- **Derive, don't mirror.** Compute from props/state at render.

  ```tsx
  // Bad
  const [count, setCount] = useState(0)
  useEffect(() => setCount(items.length), [items])
  // Good
  const count = items.length
  ```

- **Effects touch the outside world only** (subscriptions, timers, DOM measurement) and
  always return a cleanup.
- **Controlled inputs**: `value` + `onChange`, state owned by the component or form.
- **Stable keys from ids**, never array index for lists that reorder.
- **Functional updates** when new state depends on old: `setCount(c => c + 1)`.
- **Key remounts on identity changes**: `<Room key={sessionId} />` instead of hand-resetting
  each piece of state.
- **Custom hooks** for reused stateful logic.
- **Guard external data** before rendering.
- **Accessibility always**: `aria-label` on icon-only buttons, `role="menu"`/`menuitem`,
  Escape and backdrop close on dialogs, visible focus. Loading, empty and error states are
  announced (`role="status"`, `role="alert"`).
- **Native `<dialog>`** for modals — it brings focus trapping, an inert background and
  Escape without reimplementing them.
- **StrictMode** in every app.

Don't:

- Define a component inside another component (remounts every render).
- Lie to dependency arrays or silence the lint rule without a comment.
- Add `useMemo`/`useCallback` without a measured reason.
- Use effects to transform data for rendering — that's a render-time expression.
- Poll with `setInterval` where a subscription exists (`onValue`, `ResizeObserver`).
- Spread unknown props through components; declare what you accept.

## Data from outside the app

Every rule here was a real bug once.

- **All I/O goes through `lib/` or `api/`.** No database or `fetch` calls in components.
- **Guard partial records** wherever they render or are counted — a record without the field
  you are about to read is not a member of anything.
- **Stateful views remount when their entity changes** (`<RoomInner key={sessionId} />`).
- **Storage keys are namespaced** to the app: `hush.settings`, `hat.lists`. All nine apps
  share one origin, so an unprefixed key collides with a sibling.
- **Locale-aware formatting uses `Intl`**, not hand-rolled `toFixed` and `padStart`.

For realtime databases specifically:

- A multi-path `update()` may never write a record and its own child in one call. Put the
  child value inside the object.
- Stamp a `touchedAt` on every meaningful write.
- `onDisconnect` handlers remove; they never write values.
- Where server code mirrors shared logic, mark both sides. Changing either changes both, and
  the shared version is canonical.

## Styling

- **styled-components**, colocated with the component that uses it, in a `.styled.ts` file.
- **Tokens only.** Every colour, shadow, radius and font size comes from a CSS custom
  property. A hex literal outside the token block is a defect.
- **The token vocabulary is shared**: `--bg`, `--text`, `--dim`, `--line`, `--surface`. Same
  name, same meaning, every app.
- Design both light and dark. Contrast is checked, not assumed — clipping a gradient to
  text makes every stop a foreground colour, and each one has to clear AA on its own.
- Prefer a modifier prop over a specificity fight; `!important` is banned.

Apps still carrying a single stylesheet are mid-migration; convert a component's styles when
you touch it rather than in a sweep.

## Testing

Tests ship with the change. CI runs typecheck, lint and unit tests on every push; the deploy
requires them green.

Do:

- **Test behavior, not implementation**: assert what the user sees or the function returns,
  not internal state or call counts.
- **Unit-test every `lib/` export**: happy path, edges, rejections. Rules that are hard to
  reach through the UI belong in `lib/` for exactly this reason.
- **Select by role and accessible name**: `getByRole('button', { name: 'Flip' })`.
- Make tests deterministic: plant fixtures rather than racing timing.
- **Pin the numbers before refactoring arithmetic.** Record the output, change the code,
  diff the output. A wrong fallback in a calculation returns a plausible number rather than
  failing.

Don't:

- Sleep for state — the only exception is letting a finished animation settle before a
  screenshot.
- Use case-sensitive text matchers; copy is sentence case (`/add a story/i`).
- Assert on CSS classes when a role or name exists.
- Share mutable state between tests or depend on test order.
- Write conditional assertions (`if (x) expect(...)`) — a test proves one thing, always.
- Retry a flaky test into submission: fix it or delete it the day it flakes.

## General

- Sentence case everywhere; labels say what the control does ("Delete story", not "Submit").
- Comments state a constraint the code can't show — why, not what. The most useful comment
  records the alternative you rejected and the reason.
- Destructive actions confirm first and use the danger treatment.
- **Commits** are one logical change: imperative subject, a body that explains why.
  Typecheck and verify both themes before committing UI work.
- **Docs move with behavior.** An app with its own `FEATURES.md` or `DESIGN.md` updates it in
  the same commit; new conventions land here.
