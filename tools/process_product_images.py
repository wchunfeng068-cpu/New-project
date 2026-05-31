from __future__ import annotations

import argparse
import re
from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter, ImageOps, ImageStat


IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


def slugify(value: str) -> str:
    value = value.lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-") or "product"


def sample_border_color(image: Image.Image) -> tuple[int, int, int]:
    width, height = image.size
    strip = max(8, min(width, height) // 30)
    pieces = [
        image.crop((0, 0, width, strip)),
        image.crop((0, height - strip, width, height)),
        image.crop((0, 0, strip, height)),
        image.crop((width - strip, 0, width, height)),
    ]
    pixels = []
    for piece in pieces:
        pixels.extend(piece.resize((32, 32)).getdata())
    stat = ImageStat.Stat(Image.new("RGB", (len(pixels), 1)))
    stat = ImageStat.Stat(Image.frombytes("RGB", (len(pixels), 1), bytes(channel for pixel in pixels for channel in pixel)))
    return tuple(int(v) for v in stat.median)


def build_foreground_mask(image: Image.Image) -> Image.Image:
    rgb = image.convert("RGB")
    bg = sample_border_color(rgb)
    width, height = rgb.size
    pixels = rgb.load()
    mask = Image.new("L", rgb.size, 0)
    mask_pixels = mask.load()

    for y in range(height):
      for x in range(width):
        r, g, b = pixels[x, y]
        distance = abs(r - bg[0]) + abs(g - bg[1]) + abs(b - bg[2])
        darkness = max(0, 235 - max(r, g, b))
        saturation = max(r, g, b) - min(r, g, b)
        score = distance * 1.15 + darkness * 0.55 + saturation * 0.3
        if score > 52:
            mask_pixels[x, y] = 255
        elif score > 34:
            mask_pixels[x, y] = int((score - 34) / 18 * 255)

    mask = mask.filter(ImageFilter.GaussianBlur(1.2))
    mask = ImageEnhance.Contrast(mask).enhance(1.8)
    return mask


def crop_to_subject(image: Image.Image, mask: Image.Image) -> Image.Image:
    bbox = mask.point(lambda value: 255 if value > 30 else 0).getbbox()
    if not bbox:
        return image

    width, height = image.size
    left, top, right, bottom = bbox
    pad_x = int((right - left) * 0.14)
    pad_y = int((bottom - top) * 0.14)
    left = max(0, left - pad_x)
    top = max(0, top - pad_y)
    right = min(width, right + pad_x)
    bottom = min(height, bottom + pad_y)

    if (right - left) < width * 0.18 or (bottom - top) < height * 0.18:
        return image
    return image.crop((left, top, right, bottom))


def make_white_product_image(source: Path, destination: Path, size: tuple[int, int]) -> None:
    image = Image.open(source)
    image = ImageOps.exif_transpose(image).convert("RGB")

    mask = build_foreground_mask(image)
    cropped = crop_to_subject(image, mask)

    # Lift low-contrast catalog backgrounds toward white while keeping product detail.
    bright = ImageEnhance.Brightness(cropped).enhance(1.08)
    contrast = ImageEnhance.Contrast(bright).enhance(1.03)
    foreground_mask = build_foreground_mask(contrast).filter(ImageFilter.GaussianBlur(0.8))
    white = Image.new("RGB", contrast.size, "white")
    softened = Image.composite(contrast, white, foreground_mask)

    canvas = Image.new("RGB", size, "white")
    max_width = int(size[0] * 0.86)
    max_height = int(size[1] * 0.82)
    softened.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
    x = (size[0] - softened.width) // 2
    y = (size[1] - softened.height) // 2
    canvas.paste(softened, (x, y))
    destination.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(destination, quality=94, optimize=True)


def collect_sources(source_dir: Path, fallback_dir: Path) -> list[Path]:
    raw_sources = sorted(path for path in source_dir.glob("*") if path.suffix.lower() in IMAGE_EXTENSIONS)
    if raw_sources:
        return raw_sources

    fallback_names = [
        "product-finished-luggage.jpg",
        "series-luggage.jpg",
        "series-luggage333.jpg",
        "series-luggage111.jpg",
        "product-finished-luggage111.jpg",
        "194303a2-70f2-4922-a9a5-8fcafdd560f9.jpg",
        "product-semi-finished-luggage.jpg",
        "series-production123.jpg",
        "luggage-components.jpg",
        "series-handle.jpg",
        "series-handle000.jpg",
        "series-wheels.jpg",
        "series-wheels000.jpg",
        "581b5d15-ae58-4888-bd18-13d26e321c96.jpg",
        "oem-odm222.jpg",
        "oem-odm333.jpg",
        "series-production.jpg",
    ]
    return [fallback_dir / name for name in fallback_names if (fallback_dir / name).exists()]


def main() -> None:
    parser = argparse.ArgumentParser(description="Create unified white-background product gallery images.")
    parser.add_argument("--source", default="images/raw-products")
    parser.add_argument("--fallback", default="images")
    parser.add_argument("--out", default="images/product-gallery")
    parser.add_argument("--width", type=int, default=1200)
    parser.add_argument("--height", type=int, default=900)
    args = parser.parse_args()

    source_dir = Path(args.source)
    fallback_dir = Path(args.fallback)
    out_dir = Path(args.out)
    source_dir.mkdir(parents=True, exist_ok=True)
    out_dir.mkdir(parents=True, exist_ok=True)

    sources = collect_sources(source_dir, fallback_dir)
    manifest = []
    for index, source in enumerate(sources, start=1):
        output_name = f"{index:02d}-{slugify(source.stem)}.jpg"
        destination = out_dir / output_name
        make_white_product_image(source, destination, (args.width, args.height))
        manifest.append(f"{source.as_posix()} -> {destination.as_posix()}")

    (out_dir / "manifest.txt").write_text("\n".join(manifest), encoding="utf-8")
    print(f"Processed {len(manifest)} image(s) into {out_dir}")


if __name__ == "__main__":
    main()
