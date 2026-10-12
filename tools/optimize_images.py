#!/usr/bin/env python3
"""Generate optimized WebP derivatives for heavy REFERENCED images.

Hard rule: original files are NEVER modified. We only write new files under
images/optimized/ mirroring the original relative path.
"""
import os
import re
import glob
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
THRESHOLD = 250 * 1024  # only optimize images bigger than this
QUALITY = 82

# 1) collect referenced basenames
refs = set()
for pat in ("*.html", "*.js", "*.css"):
    for p in glob.glob(os.path.join(ROOT, "**", pat), recursive=True):
        if "node_modules" in p:
            continue
        try:
            text = open(p, encoding="utf-8", errors="ignore").read()
        except Exception:
            continue
        for m in re.findall(r'[\w\-/\.\(\)\s%]+\.(?:png|jpg|jpeg)', text):
            refs.add(os.path.basename(m.strip()))

# 2) convert
out_dir_base = os.path.join(ROOT, "images", "optimized")
total_before = total_after = 0
converted = []

for root, _, files in os.walk(os.path.join(ROOT, "images")):
    if os.path.abspath(root).startswith(os.path.abspath(out_dir_base)):
        continue  # never process our own output
    for f in files:
        if f not in refs:
            continue
        if not f.lower().endswith((".png", ".jpg", ".jpeg")):
            continue
        src = os.path.join(root, f)
        size = os.path.getsize(src)
        if size <= THRESHOLD:
            continue
        rel = os.path.relpath(src, os.path.join(ROOT, "images"))
        dst = os.path.join(out_dir_base, os.path.splitext(rel)[0] + ".webp")
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        try:
            with Image.open(src) as im:
                # Preserve transparency: never flatten alpha to RGB (would go black).
                if im.mode in ("RGBA", "LA") or (
                    im.mode == "P" and "transparency" in im.info
                ):
                    im = im.convert("RGBA")
                elif im.mode != "RGB":
                    im = im.convert("RGB")
                im.save(dst, "WEBP", quality=QUALITY, method=6)
        except Exception as e:
            print(f"SKIP {src}: {e}")
            continue
        new = os.path.getsize(dst)
        if new >= size:
            os.remove(dst)  # no gain, don't keep a bigger file
            continue
        total_before += size
        total_after += new
        converted.append((size, new, rel))

converted.sort(reverse=True)
print(f"转换完成: {len(converted)} 个文件")
print(f"原体积: {total_before/1048576:.1f} MB  ->  WebP: {total_after/1048576:.1f} MB")
if total_before:
    print(f"节省: {(1-total_after/total_before)*100:.0f}%")
print("--- 前 8 个 ---")
for b, a, rel in converted[:8]:
    print(f"  {b/1024:7.0f}KB -> {a/1024:6.0f}KB  {rel}")
