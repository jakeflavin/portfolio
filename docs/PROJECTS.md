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
preview of anything. A phone mockup composed by hand in HTML was tried too, and it read as
a marketing page. The app's own pixels, at the right moment, are the only material that
match the app's design and still preview it.

### New covers are made with bezl

From 2026-09-29 a new cover is the app's own screenshot framed by
[bezl](https://github.com/jakeflavin/bezl) (`@jakeflavin/bezl`), not a raw crop. Everything
above still holds: it is the running app, mid-job, with real data, and no words. Bezl
supplies the frame and the canvas. Covers made before that date stay as they are until they
are redone.

Three files make a cover, and all three are committed:

| File | What it is |
|---|---|
| `assets/covers/<slug>.png` | The raw screen, mid-job, at the shape of the window or device. |
| `.bezl/<slug>-cover.json` | The bezl document: device, finish, placement, canvas, background. |
| `public/images/<slug>-cover.jpg` | The render the card shows. |

```bash
# A web app: the screen in a Safari window, on a square canvas.
npx @jakeflavin/bezl image assets/covers/<slug>.png model=none window=safari \
  window.url=portfolio-4b9fe.web.app/<slug> window.theme=dark height=0.82 y=0.5 \
  -c 1080x1080 -b "#1b2a6b,#8a4fe0@160" -o public/images/<slug>-cover.jpg --save <slug>-cover

# Later: render the same cover again from the document.
npx @jakeflavin/bezl export <slug>-cover
```

`bezl doctor` checks that headless Chrome is available. It needs Node 22.12 or newer.

- **A web app goes in a Safari window.** That is what it is. A tilted phone was tried first
  for Rocket and rejected. Use a phone (`model=iphone-18-pro`) only where the product is a
  phone, as Goals is.
- **Capture the raw screen at the shape of the window**, close to square (Rocket's is
  900×820 at 2×), so the window fills the canvas and the app is not shrunk to fit. An app
  with a narrow column, like Rocket, still shows its sides; that is how it looks.
- **The canvas is a plain square with padding around the window.** Height 0.82 leaves about
  85px a side at 1080. No tilt, no crop, and the window is never cut by the edge.
- **Do not let a pop-up cover the subject.** Rocket's first frame had a score pop-up over
  the rocket. Look at the frame before it is framed.
- **No text layers.** The card prints the title, so the cover carries none.
- **Pick the background from the app's palette**, and against it. Check the render at 158px
  before it is committed.
- **Phone-shaped apps** take the device they are shaped like: capture at its native size
  (iPhone 18 Pro is 402×874 at 3×), and give the page the safe-area insets a real phone
  reports, because headless Chrome reports zero and the header lands under the Dynamic
  Island. Inject `:root { --sat: 59px; --sab: 34px }` before the shot. A Mac app takes
  `model=macbook-pro-14 window=mac`. `bezl devices` lists them all.

Rocket's is the worked example: `.bezl/rocket-cover.json`.

### Demo videos

A demo is the app in a Safari window with padding, like the cover, and nothing else: one
continuous take of real use. **No intro or outro cards and no caption text** unless it is
asked for. Rocket's is `.bezl/rocket-demo.json`, on the `threads` canvas (1080×1350, 4:5):

```bash
npx @jakeflavin/bezl video assets/demos/<slug>.mp4 model=none window=safari \
  window.url=portfolio-4b9fe.web.app/<slug> window.theme=dark y=0.5 height=0.82 \
  -c threads -b "#1b2a6b,#8a4fe0@160" -o .bezl/out/<slug>-demo.mp4 --save <slug>-demo
```

Re-render with `npx @jakeflavin/bezl export <slug>-demo`. The render is in `.bezl/out/`,
which git ignores.

- **Record with a CDP screencast, not Playwright's `recordVideo`.** The built-in video is
  heavily compressed. Save JPEG frames with their timestamps, then assemble them with
  ffmpeg's concat demuxer at 30fps.
- **A game with a bot.** Rocket exposes `window.__stardust`, so a dodge bot flies it while
  the screencast runs.
- **Trim the ends, not the middle.** Commit the trimmed take (`assets/demos/<slug>.mp4`),
  not the raw one.
- **Start after the app's own title screen** if its name differs from the card's. Rocket's
  title screen says "Stardust Run".
- **Check the disk first.** A render needs a gigabyte or more of temporary frames.
