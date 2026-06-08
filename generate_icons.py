"""Generate RiddleDaily extension icons."""
from PIL import Image, ImageDraw, ImageFont
import os

SIZES = [16, 48, 128]
OUT_DIR = os.path.join(os.path.dirname(__file__), 'icons')
os.makedirs(OUT_DIR, exist_ok=True)

def create_icon(size):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Gradient-like background circle
    margin = max(1, size // 16)
    draw.ellipse([margin, margin, size - margin, size - margin], fill=(139, 92, 246, 255))

    # Inner lighter circle
    inner = size // 5
    draw.ellipse([inner, inner, size - inner, size - inner], fill=(167, 139, 250, 255))

    # Puzzle piece shape (simplified)
    cx, cy = size // 2, size // 2
    r = size // 4
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(255, 255, 255, 240))

    # Question mark
    font_size = max(8, size // 3)
    try:
        font = ImageFont.truetype("arial.ttf", font_size)
    except OSError:
        font = ImageFont.load_default()

    text = "?"
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    draw.text((cx - tw // 2, cy - th // 2 - 1), text, fill=(139, 92, 246, 255), font=font)

    path = os.path.join(OUT_DIR, f'icon{size}.png')
    img.save(path, 'PNG')
    print(f'Created {path}')

for s in SIZES:
    create_icon(s)
