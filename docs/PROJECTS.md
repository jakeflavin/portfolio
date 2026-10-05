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

### Covers are made with bezl

Every cover is the app's own screenshot framed by
[bezl](https://github.com/jakeflavin/bezl) (`@jakeflavin/bezl`). Everything above still
holds: it is the running app, mid-job, with real data, and no words. Bezl supplies the frame
and the canvas. On 2026-09-29 all fifteen covers were redone this way, so the older square
crops are gone.

The rules, as Jake set them:

- **The canvas is a 1080 square.** No exceptions.
- **The background is one solid colour**, drawn at random from the five stops of the site's
  gradient (`brandStops` in `src/styles/themes.js`: `#2244D8`, `#4A42A9`, `#72407A`,
  `#9B3E4B`, `#C33C1C`). No gradient, no text. Two neighbours in `apps.json` never share a
  colour, so a repeat is rolled again.
- **The mockup is centred both ways.** Nothing is tilted, cropped or cut by the canvas edge.
- **A web tool goes in a Safari window**, and its screenshot is a rectangle, never a square.
  Every web cover uses the same window, so the raw screen is always 16:10 (1280x800 at 2x).
  Mismatched windows look wrong side by side in the grid, so `bezl-cover.mjs` fixes the window
  size and refuses a raw of any other shape. A raw that is not 16:10 is trimmed or padded to
  it first, never scaled: cut from the bottom (`sips --cropToHeightWidth H W --cropOffset 0 0`)
  or padded with the app's own background colour (`sips --padToHeightWidth`).
- **An iOS app goes in an iPhone** (`model=iphone-18-pro`). Only Goals is one. Its screen is
  the landing page's own native capture, `apps/goals-web/src/shots/home-light.png`, scaled to
  720 wide (`sips --resampleWidth 720`).

Three files make a cover, and all three are committed:

| File | What it is |
|---|---|
| `assets/covers/<slug>.png` | The raw screen, mid-job, at the shape of the window or device. |
| `.bezl/<slug>-cover.json` | The bezl document: window or phone, placement, canvas, colour. |
| `public/images/<slug>-cover.jpg` | The render the card shows. |

```bash
# 1. The raw screen. It is a viewport, not a crop: --clip none. The shot recorded in
#    apps.json holds the steps, the seed and the viewport.
node scripts/capture-cover.mjs apps/<dir> --slug <slug> --clip none --out assets/covers/<slug>.png

# 2. Frame it. Picks a colour, sizes the window from the raw's own shape, renders 1080x1080.
node scripts/bezl-cover.mjs <slug>            # a web tool
node scripts/bezl-cover.mjs <slug> --phone    # an iOS app
node scripts/bezl-cover.mjs <slug> --color '#4A42A9'   # choose the colour
node scripts/bezl-cover.mjs <slug> --reroll            # draw a new one
```

`bezl-cover.mjs` keeps the colour in the bezl document, so running it again reproduces the
same cover. `npx @jakeflavin/bezl export <slug>-cover` also re-renders from the document.
`bezl doctor` checks that headless Chrome is available. It needs Node 22.12 or newer.

- **Look at the frame before it is framed.** Contact-sheet filenames sort differently from
  how they read, and a pop-up can sit over the subject. Rocket's first frame had a score pop-up
  over the rocket.
- **A viewport is allowed to cut the page.** In a browser window the page runs off the
  bottom, as it does for a real visitor. What is not allowed is a panel sliced through its
  words that looks broken, or a hide rule that leaves an empty column (Trace's first frame).
- **No text layers.** The card prints the title, so the cover carries none.
- **Check the render at 158px** before it is committed.
- **Phone-shaped apps** take the device they are shaped like: capture at its native size
  (iPhone 18 Pro is 402x874 at 3x), and give the page the safe-area insets a real phone
  reports, because headless Chrome reports zero and the header lands under the Dynamic
  Island. Inject `:root { --sat: 59px; --sab: 34px }` before the shot.
- **Rocket has no capture entry.** It is played by a dodge bot through `window.__stardust`
  (`startRun()`, then steer `P.tx` from `obs` and `dust`) at 1000x625, and a frame is picked by
  eye from screenshots taken every 1.2 s. Call `startRun()` rather than clicking Launch: the
  button animates, so a click never sees it stable.
- **Runify, Linkit, Weather and Fibo** keep their earlier hand or emulator raw screens.
  Runify, Linkit and Weather are trimmed at the bottom to 16:10; Fibo is padded top and bottom
  with `#242528`. Their recorded `shot` steps reproduce the moment, not the exact pixels.
  Tack's raw is 1280x900, trimmed the same way, which drops the widget palette strip.

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
