# Avatar sources

The originals behind the profile photo. Nothing here ships: `scripts/make-avatars.mjs`
crops them into `public/images/avatars/`, which is what the site loads.

Keep the file stems matching the `CROPS` table in that script. To reframe a photo, change
its `centre` and `span` there and run the script again.

```
node scripts/make-avatars.mjs
```
