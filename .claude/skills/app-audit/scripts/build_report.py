#!/usr/bin/env python3
"""
Inline screenshots into the report HTML.

Artifacts must be self-contained and cap at 16MB, so every image has to travel as
a data URI. Full-size retina PNGs blow that budget fast; downscaled JPEGs don't.

  python3 build_report.py report.src.html shots/ report.html [--width 1100] [--quality 62]

In the source HTML, reference a screenshot by its filename without extension:

  <img src="__IMG_desktop-01-landing__" alt="...">

Every placeholder must resolve or the build fails loudly — a silently missing
screenshot in a report whose whole promise is "every finding has evidence" is
worse than a broken build.
"""
import base64, os, re, subprocess, sys, tempfile

def die(msg):
    print(f"error: {msg}", file=sys.stderr)
    sys.exit(1)

def encode(src, width, quality, cache):
    if src in cache:
        return cache[src]
    ext = os.path.splitext(src)[1].lower()
    if ext in ('.jpg', '.jpeg'):
        data, mime = open(src, 'rb').read(), 'image/jpeg'
    else:
        with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as tmp:
            out = tmp.name
        # sips ships with macOS; ImageMagick is the fallback elsewhere.
        cmd = ['sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', str(quality),
               '-Z', str(width), src, '--out', out]
        if subprocess.run(cmd, capture_output=True).returncode != 0:
            cmd = ['magick', src, '-resize', f'{width}x{width}>', '-quality', str(quality), out]
            if subprocess.run(cmd, capture_output=True).returncode != 0:
                die(f'could not convert {src} — need sips (macOS) or ImageMagick')
        data, mime = open(out, 'rb').read(), 'image/jpeg'
        os.unlink(out)
    uri = f'data:{mime};base64,' + base64.b64encode(data).decode()
    cache[src] = uri
    return uri

def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    flags = {a.split('=')[0]: a.split('=')[1] for a in sys.argv[1:] if '=' in a and a.startswith('--')}
    if len(args) < 3:
        die('usage: build_report.py <src.html> <shots-dir> <out.html> [--width=1100] [--quality=62]')
    src_html, shots, out_html = args[0], args[1], args[2]
    width, quality = int(flags.get('--width', 1100)), int(flags.get('--quality', 62))

    html = open(src_html).read()
    cache, missing, used = {}, [], set()

    def sub(m):
        name = m.group(1)
        for ext in ('.png', '.jpg', '.jpeg'):
            p = os.path.join(shots, name + ext)
            if os.path.exists(p):
                used.add(name)
                return encode(p, width, quality, cache)
        missing.append(name)
        return ''

    out = re.sub(r'__IMG_([A-Za-z0-9._-]+)__', sub, html)

    if missing:
        die('no screenshot found for: ' + ', '.join(sorted(set(missing))))

    open(out_html, 'w').write(out)
    mb = len(out.encode()) / 1024 / 1024
    print(f'{len(used)} screenshots inlined ({len(cache)} unique files)')
    print(f'{out_html} — {mb:.2f} MB')
    if mb > 15:
        print('WARNING: close to the 16MB artifact limit — lower --width or --quality', file=sys.stderr)

if __name__ == '__main__':
    main()
