# Adding a project to the directory

Everything a card shows comes from one entry in `apps.json`. These are the rules that
entry has to meet. `node scripts/add-app.mjs` writes the entry; this is what to check
before it ships.

## The description

Blunt, and straight to the point. Short declarative sentences. No filler.

The test is whether it sounds like the bio at the top of the page: *"I build things on the
internet for fun. All apps are local. No accounts."* Not like a product page.

- **No em dashes and no en dashes.** A dash is where a sentence should have ended. Use a
  full stop. This is the single clearest tell that a description was not written by hand.
- **No "seamlessly", "effortlessly", "powerful", "beautiful", "simply", "just".** If a
  word could be deleted without losing a fact, delete it.
- **No subordinate clauses stacked on a main one.** Two short sentences beat one long one.
- **Say what it does, then what it does not do.** The second half is often the interesting
  one, because most of these apps are defined by what they refuse to ask for.
- **About 80 to 180 characters.** Under 80 says nothing. Over 180 stops being read, and
  the list view cuts it at three lines.

Good:

> A shared board of links. Post what you find, vote on what everyone else posts. No names
> and no accounts. Downvotes do the pruning.

Bad, and this is roughly what the first pass of every one of these looked like:

> An anonymous, community-run board of links worth keeping — post what you find, vote on
> what others post, and let the downvotes do the pruning.

## The tags

**Two, or three. Never more.** Tags are for the person looking for an app, not for the
person who built it. They answer "is this for me?" and nothing else.

1. **Who it is for.** `teacher`, `student`, `kid`, `parent`, `developer`, `runner`, `team`.
2. **What kind of thing it is.** `utility`, `focus`, `fitness`, `weather`, `game`,
   `planning`, `classroom`, `links`.
3. **Optional third**, and only where an app genuinely lands in two of either. Fibo is a
   `team` tool and a `developer` one. Countdown is for a `student` and for a `teacher`.
   If the third tag is only there to describe the app more precisely, cut it.

Never tag the implementation. `charts`, `gpx`, `realtime`, `maps` and `audio` all went in
the first pass and none of them are a reason anybody picks an app.

Reuse an existing tag before inventing one. Twenty-two tags across eight apps meant no tag
grouped anything with anything.

## The cover

The covers are the whole page. Every other element on a card exists to caption one.

- **A screenshot of the app**, not a graphic about the app.
- **Of something worth looking at.** The most characteristic screen, not the first one.
- **With real data in it.** An app photographed empty tells you nothing: linkit's first
  cover was a board with no links on it, which is a picture of a blank page.
- **Legible at 158px**, which is what the grid gives it, and at 104px in the list. If the
  app has to be read to be understood at that size, it is the wrong frame.

Framing lives in the entry's `shot` key so a capture reproduces in a later session without
anyone remembering the flags:

```jsonc
"shot": {
  "viewport": { "width": 1240, "height": 1400 },  // render at a real width
  "clip": { "x": 4, "y": 424, "size": 680 },      // cut the square out of that
  "hide": "header,footer",                        // the app's own chrome duplicates the card
  "wait": 5000,                                   // video, fonts, entry animation
  "env": { "VITE_FIRESTORE_EMULATOR": "1" },      // point at a local emulator, never live data
  "seed": { "hat.lists": [ /* … */ ] },           // localStorage the app would have written
  "actions": [ { "selector": "…", "wait": 900 } ] // clicks and typing, in order
}
```

Render at a width the app was designed for and cut the cover out of it. A square viewport
is a shape no app has a layout for, so it meets a breakpoint it never expects and the
screenshot shows an arrangement nobody will ever see.

Prefer `seed` over `actions` where the state is something the user typed. Writing the
localStorage the app would have written is faster, does not break when a button moves, and
reproduces exactly.

```bash
node scripts/capture-cover.mjs apps/<app> --slug <slug>
```

### When the shot has to be taken by hand

Some covers cannot be described in a config: the frame needs a route somebody drew, a room
somebody filled, a moment. Take the screenshot yourself, put it at
`assets/covers/<slug>.png`, and cut the square out of it:

```bash
node scripts/crop-cover.mjs <slug> --x 0 --y 100 --size 830 --save
```

`--save` writes the crop back to the entry, so the same square comes back later. The
source is committed too, which means a cover can be reframed without going back to the app
for another screenshot.

Crop so nothing is sliced. A panel cut through the middle of its words reads as a broken
screenshot, not as a crop - if the side panel does not fit whole, leave it out and let the
cover be the part that carries the app.

## The date

`creationDate` is what the card shows and what the default sort uses. Set it to when the
app was actually made.

Eight apps all dated the same week reads as one weekend of work rather than a year of it,
which is the opposite of what a portfolio is for. The current set is spread across nine
months. A new app takes today's date; a backfilled one takes its real date.
