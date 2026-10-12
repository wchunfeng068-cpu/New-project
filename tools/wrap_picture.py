#!/usr/bin/env python3
"""Wrap heavy <img> tags in <picture> so browsers load the optimized WebP
while the untouched original stays as the fallback source.

Original files are never modified — this only edits HTML markup.
"""
import os
import re
import glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def to_webp(src):
    """images/foo.png  ->  images/optimized/foo.webp  (keeps ../ prefix)."""
    m = re.search(r"(images/)(.+)$", src)
    if not m:
        return None
    prefix = src[: m.start(1)]
    rest = m.group(2)
    base = os.path.splitext(rest)[0]
    return f"{prefix}images/optimized/{base}.webp"


total = 0
for html in glob.glob(os.path.join(ROOT, "**", "*.html"), recursive=True):
    if "node_modules" in html:
        continue
    text = open(html, encoding="utf-8").read()
    if "<picture" in text:  # already processed
        continue
    changed = [0]

    def repl(mo):
        tag = mo.group(0)
        sm = re.search(r'src="([^"]+)"', tag)
        if not sm:
            return tag
        src = sm.group(1)
        webp_src = to_webp(src)
        if not webp_src:
            return tag
        webp_path = os.path.normpath(
            os.path.join(os.path.dirname(html), webp_src)
        )
        if not os.path.exists(webp_path):
            return tag
        changed[0] += 1
        return f'<picture><source srcset="{webp_src}" type="image/webp" />{tag}</picture>'

    new = re.sub(r"<img\b[^>]*>", repl, text, flags=re.S)
    if changed[0]:
        open(html, "w", encoding="utf-8").write(new)
        total += changed[0]
        print(f"{os.path.relpath(html, ROOT)}: {changed[0]} 张接入 WebP")

print(f"\n合计 {total} 张图片已接入 WebP（原图保留为 fallback）")
