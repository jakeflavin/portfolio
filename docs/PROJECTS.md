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

- **A screenshot of the app, caught in the middle of doing its job.** Not the app at rest,
  and not a graphic about the app. Hat's first cover was a number on a gradient, which is
  what Hat looks like when nobody is using it, and it said nothing. Its cover now is the
  roll: the number landing under the app's own confetti. Countdown is captured seven
  seconds after Start, Hush with the dial swung into red, Mixtape with the case open and
  the disc half out. The test is whether the frame could only have been taken while
  someone was using it.
- **With real data in it.** An app photographed empty tells you nothing: linkit's first
  cover was a board with no links on it, which is a picture of a blank page.
- **One thing, large.** A whole dashboard at 158px is texture. Cut to the part that
  carries the app: weather is its numbers and one chart, tack is four tiles, not the board.
- **Nothing sliced.** A panel cut through the middle of its words reads as a broken
  screenshot, not as a crop. If the side panel does not fit whole, leave it out.
- **No name and no words about the app in the image.** The card prints the title; the
  cover shows the thing. An app's own chrome comes off for the same reason.
- **Legible at 158px**, which is what the grid gives it, and at 104px in the list. If the
  app has to be read to be understood at that size, it is the wrong frame.

Generated pictures were tried and rejected. An illustration of "a classroom with a loud
dial" is in somebody else's style, looks like every other generated cover, and is not a
preview of anything. A phone mockup around a screenshot was tried too, and it read as a
marketing page. The app's own pixels, at the right moment, are the only material that
match the app's design and still preview it.

Framing lives in the entry's `shot` key so a capture reproduces in a later session without
anyone remembering the flags:

```jsonc
"shot": {
  "viewport": { "width": 1240, "height": 1400 },  // render at a real width
  "clip": { "x": 4, "y": 424, "size": 680 },      // cut the square out of that
  "hide": "header,footer",                        // the app's own chrome duplicates the card
  "wait": 5000,                                   // video, fonts, entry animation
  "env": { "VITE_FIRESTORE_EMULATOR": "1" },      // point at a local emulator, never live data
  "seed": { "hat.settings": { /* … */ } },        // localStorage the app would have written
  "query": "?timer=5m&names=Ada,Bea",             // for an app that keeps its state in the link
  "actions": [ { "selector": "…", "wait": 900 } ],// clicks and typing, in order
  "mic": true,                                    // a fake microphone, for an app that listens
  "css": "main > * { visibility: hidden }",       // framing `hide` cannot express
  "scale": 3                                      // device pixel ratio (default 2)
}
```

Render at a width the app was designed for and cut the cover out of it. A square viewport
is a shape no app has a layout for, so it meets a breakpoint it never expects and the
screenshot shows an arrangement nobody will ever see. Weather is the exception that proves
it: at desktop width its numbers and its chart cannot share a square, so it is rendered at
760px, where its own tablet layout stacks them.

**The moment is an action with a wait.** `{ "selector": "button:has-text('Roll')", "wait":
1350 }` is Hat's roll caught mid-confetti; an action with only a `wait` is a pause for fonts
before the first click. `wait` at the top level runs *after* the actions, so an app shot
mid-animation sets it to 0. A step with `click: [x, y]` clicks a point, which is the way to
press a button whose text several widgets share. `move: [x, y]` only parks the pointer:
tack's tiles show a toolbar under the mouse, and the pointer is still on the Roll button
when the shot is taken unless something moves it off. Hush cannot be driven without a microphone;
`mic: true` grants Chromium's fake one, whose steady tone is loud enough to swing the dial.

Prefer `seed` over `actions` where the state is something the user typed. Writing the
localStorage the app would have written is faster, does not break when a button moves, and
reproduces exactly. `query` is the same idea for tack, which stores nothing at all: a board
exists only as its URL, so the query string *is* the state.

`scale` matters only when the clip is small. Two is plenty for a cover cut out of a whole
screen; glyph's is one 400px panel, and at 2 the file would come out smaller than every
other cover in the folder.

Some captures need a service behind them. linkit reads a Firestore emulator: start it with
`npm run emulators` in the app, seed it with `npm run seed`, then capture.

### When the app is not a web page

goals is an iPhone app, and its entry in the directory is its landing page. A screenshot
of a landing page is a picture of marketing, so its cover is the phone that page draws:
the landing's own frame component around the real home screen, pulled out of the hero
with `css` and enlarged to fill the square. That is the one phone mockup in the set, and
it is there because the product is a phone. A web app in a phone frame was tried for hat
and rejected; it read as a marketing page for something that is not one.

### When the output is the better picture

An app whose output is itself a picture shows the output: glyph's cover is the code it
just made, with the app's own chrome hidden, because a QR code is legible at 158px and a
customiser is not. That code points at the app, so the card in the grid is a working one:
scan the directory page and it opens. It is still a screenshot of the running app rather
than a drawing of one, which is the part of the rule that matters.

```bash
node scripts/capture-cover.mjs apps/<app> --slug <slug>
```

`--clip none` and `--viewport WxH` override the entry while a frame is being found, so the
whole render can be looked at before the square is chosen.

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

## The date

`creationDate` is what the card shows and what the default sort uses. Set it to when the
app was actually made.

Eight apps all dated the same week reads as one weekend of work rather than a year of it,
which is the opposite of what a portfolio is for. The current set is spread across nine
months. A new app takes today's date; a backfilled one takes its real date.
