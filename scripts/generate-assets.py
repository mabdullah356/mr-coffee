"""Generate the extra raster artwork used by the page.

Everything is painted locally with Pillow. No SVG, no stock images, no network.
Run: python scripts/generate-assets.py
"""
from pathlib import Path
import math
import random

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1] / "src" / "assets" / "images"
PUBLIC = Path(__file__).resolve().parents[1] / "public"
FONT_DIR = Path("C:/Windows/Fonts")

GREEN = (41, 53, 30, 255)
DEEP = (26, 33, 23, 255)
LIME = (141, 201, 60, 255)
LIME_SOFT = (166, 224, 58, 255)
CREAM = (251, 247, 235, 255)
BERRY = (176, 26, 67, 255)
LINE_GREEN = (42, 67, 33, 235)


def ensure(folder):
    target = ROOT / folder
    target.mkdir(parents=True, exist_ok=True)
    return target


def aa(size, supersample=4):
    return Image.new("RGBA", (size[0] * supersample, size[1] * supersample), (0, 0, 0, 0)), supersample


def save_aa(image, supersample, path, optimize=True):
    w, h = image.width // supersample, image.height // supersample
    image.resize((w, h), Image.Resampling.LANCZOS).save(path, "PNG", optimize=optimize)
    print(f"wrote {path} {w}x{h}")


def radial(size, inner, outer, center=(0.5, 0.45), radius=0.75):
    w, h = size
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    cx, cy = center[0] * w, center[1] * h
    d = np.sqrt(((xx - cx) / (radius * w)) ** 2 + ((yy - cy) / (radius * h)) ** 2)
    d = np.clip(d, 0, 1)[..., None]
    rgb = np.array(inner, np.float32) * (1 - d) + np.array(outer, np.float32) * d
    return Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8), "RGB")


def hill():
    w, h, ss = 2560, 700, 2
    img, s = aa((w, h), ss)
    W, H = img.size
    d = ImageDraw.Draw(img)
    top = []
    for x in range(W + 1):
        t = x / W
        y = (0.36 + 0.052 * math.sin(math.tau * 2 * t + 0.5) + 0.026 * math.sin(math.tau * 5 * t + 1.4) + 0.014 * math.sin(math.tau * 9 * t)) * H
        top.append((x, y))
    d.polygon(top + [(W, H), (0, H)], fill=GREEN)
    detail = Image.new("RGBA", img.size, (0, 0, 0, 0))
    dd = ImageDraw.Draw(detail)
    rng = random.Random(7)
    for _ in range(420):
        x = rng.randint(0, W)
        t = x / W
        y = (0.36 + 0.052 * math.sin(math.tau * 2 * t + 0.5) + 0.026 * math.sin(math.tau * 5 * t + 1.4)) * H + rng.randint(10, H)
        r = rng.randint(3, 18) * ss
        shade = rng.choice([(30, 42, 22, 60), (55, 73, 34, 45), (22, 31, 17, 55)])
        dd.ellipse((x - r, y - r * 0.4, x + r, y + r * 0.4), fill=shade)
    img = Image.alpha_composite(img, detail.filter(ImageFilter.GaussianBlur(6 * ss)))
    d = ImageDraw.Draw(img)
    for x in range(0, W, 23 * ss):
        t = x / W
        base_y = (0.36 + 0.052 * math.sin(math.tau * 2 * t + 0.5) + 0.026 * math.sin(math.tau * 5 * t + 1.4) + 0.014 * math.sin(math.tau * 9 * t)) * H
        length = rng.uniform(16, 48) * ss
        lean = rng.uniform(-16, 16) * ss
        shade = rng.choice([(57, 75, 36, 255), (46, 63, 30, 255), (70, 90, 41, 255)])
        d.line([(x, base_y + 2), (x + lean * 0.4, base_y - length * 0.6), (x + lean, base_y - length)], fill=shade, width=int(1.6 * ss))
    save_aa(img, s, ensure("hero") / "hero-hill.png")


def wave():
    w, h, ss = 2400, 420, 2
    img, s = aa((w, h), ss)
    W, H = img.size
    d = ImageDraw.Draw(img)
    def top(x):
        t = x / W
        return (0.42 + 0.085 * math.sin(math.tau * 3 * t + 0.8) + 0.042 * math.sin(math.tau * 5 * t + 2.2) + 0.018 * math.sin(math.tau * 9 * t)) * H
    pts = [(x, top(x)) for x in range(W + 1)]
    d.polygon(pts + [(W, H), (0, H)], fill=GREEN)
    for i, (dy, alpha, width) in enumerate([(28, 26, 9), (60, 18, 5), (96, 12, 3)]):
        line = [(x, top(x) + dy * ss) for x in range(0, W + 1, 8 * ss)]
        d.line(line, fill=(22, 31, 17, alpha), width=int(width * ss), joint="curve")
    save_aa(img, s, ensure("wave") / "wave-edge.png")


def whisk():
    size = 512
    img, s = aa((size, size), 4)
    W = img.width
    d = ImageDraw.Draw(img)
    col = LIME_SOFT
    lw = int(7 * s)
    # bowl
    d.arc((86 * s, 250 * s, 426 * s, 470 * s), 0, 180, fill=col, width=lw)
    d.ellipse((86 * s, 238 * s, 426 * s, 318 * s), outline=col, width=lw)
    # handle
    d.line((256 * s, 78 * s, 256 * s, 232 * s), fill=col, width=int(9 * s))
    d.arc((222 * s, 52 * s, 290 * s, 106 * s), 180, 360, fill=col, width=lw)
    # tines
    tips = [(214, 318), (228, 326), (242, 332), (256, 334), (270, 332), (284, 326), (298, 318), (206, 306), (306, 306)]
    for i, (tx, ty) in enumerate(tips):
        sx = 242 * s + (i % 5) * 7 * s
        sy = 214 * s
        ex, ey = tx * s, (ty + 30) * s
        mx = (sx + ex) / 2
        my = (sy + ey) / 2 - 6 * s
        pts = []
        for step in range(19):
            t = step / 18
            x = (1 - t) ** 2 * sx + 2 * (1 - t) * t * mx + t * t * ex
            y = (1 - t) ** 2 * sy + 2 * (1 - t) * t * my + t * t * ey
            pts.append((x, y))
        d.line(pts, fill=col, width=int(3 * s), joint="curve")
    save_aa(img, s, ensure("preloader") / "whisk-bowl.png")


def cursor():
    size = 256
    ss = 3
    base = radial((size * ss, size * ss), (120, 166, 74), (244, 240, 214), center=(0.44, 0.42), radius=0.62).convert("RGBA")
    d = ImageDraw.Draw(base)
    W = base.width
    rng = random.Random(11)
    # creamy swirl
    for i, (cx, cy, r, start, end) in enumerate([(0.48, 0.5, 0.44, 20, 300), (0.55, 0.44, 0.34, 120, 410), (0.46, 0.56, 0.25, 250, 520)]):
        d.arc((int((cx - r / 2) * W), int((cy - r / 2) * W), int((cx + r / 2) * W), int((cy + r / 2) * W)), start, end,
              fill=(247, 245, 228, 210 - i * 40), width=int((15 - i * 3) * ss))
    for _ in range(28):
        x, y = rng.randint(int(W * .18), int(W * .82)), rng.randint(int(W * .18), int(W * .82))
        rr = rng.randint(2, 7) * ss
        d.ellipse((x - rr, y - rr, x + rr, y + rr), fill=(250, 249, 236, rng.randint(80, 170)))
    mask = Image.new("L", (W, W), 0)
    ImageDraw.Draw(mask).ellipse((int(3 * ss), int(3 * ss), W - int(3 * ss), W - int(3 * ss)), fill=255)
    base.putalpha(mask)
    ring = ImageDraw.Draw(base)
    ring.ellipse((int(2 * ss), int(2 * ss), W - int(2 * ss), W - int(2 * ss)), outline=(255, 255, 255, 235), width=int(5 * ss))
    base.resize((size, size), Image.Resampling.LANCZOS).save(ensure("brand") / "cursor-matcha.png", "PNG", optimize=True)
    print(f"wrote cursor-matcha.png {size}x{size}")


def draw_leaf(d, cx, cy, length, width, angle, veins=4):
    steps = 40
    pts_top, pts_bottom = [], []
    for i in range(steps + 1):
        t = i / steps
        x = (t - 0.5) * length
        bulge = math.sin(math.pi * t) * width * 0.5
        pts_top.append((x, -bulge))
        pts_bottom.append((x, bulge))
    poly = pts_top + pts_bottom[::-1]
    ca, sa = math.cos(angle), math.sin(angle)
    poly = [(cx + x * ca - y * sa, cy + x * sa + y * ca) for x, y in poly]
    d.polygon(poly, outline=LINE_GREEN, fill=(166, 224, 58, 18))
    # midrib
    p1 = (cx + (-length / 2) * ca, cy + (-length / 2) * sa)
    p2 = (cx + (length / 2) * ca, cy + (length / 2) * sa)
    d.line([p1, p2], fill=LINE_GREEN, width=max(2, int(width * 0.035)))
    for i in range(1, veins + 1):
        t = i / (veins + 1)
        x = (t - 0.5) * length
        base = (cx + x * ca, cy + x * sa)
        side = 1 if i % 2 else -1
        for sign in (-1, 1):
            vx = x + side * length * 0.1
            vy = sign * width * 0.32
            tip = (cx + vx * ca - vy * sa, cy + vx * sa + vy * ca)
            d.line([base, tip], fill=(42, 67, 33, 170), width=max(1, int(width * 0.02)))


def leaves():
    configs = {
        "leaf-a.png": [(0.34, 0.74, 320, 130, -0.75), (0.58, 0.52, 360, 140, -0.35), (0.5, 0.3, 300, 120, 0.85)],
        "leaf-b.png": [(0.5, 0.78, 250, 190, -1.35), (0.42, 0.5, 280, 210, -1.0), (0.6, 0.34, 280, 200, 0.9), (0.58, 0.55, 300, 210, 0.4)],
        "leaf-c.png": [(0.36, 0.72, 430, 92, -1.1), (0.64, 0.3, 450, 96, -0.9)],
    }
    for name, spec in configs.items():
        w, h, ss = 900, 1100, 2
        img, s = aa((w, h), ss)
        W, H = img.size
        d = ImageDraw.Draw(img)
        # branch
        d.line([(int(w * .12 * s), int(h * .92 * s)), (int(w * .55 * s), int(h * .48 * s)), (int(w * .86 * s), int(h * .12 * s))],
               fill=LINE_GREEN, width=int(6 * s), joint="curve")
        for i, (cx, cy, length, width, angle) in enumerate(spec):
            draw_leaf(d, cx * W, cy * H, length * s, width * s, angle, veins=5 if i % 2 else 4)
        save_aa(img, s, ensure("leaves") / name)


def strawberry_whole(size=700):
    ss = 3
    W = size * ss
    img = Image.new("RGBA", (W, W), (0, 0, 0, 0))
    body_mask = Image.new("L", (W, W), 0)
    md = ImageDraw.Draw(body_mask)
    # plump berry, pointed tip
    md.ellipse((int(W * .18), int(W * .24), int(W * .82), int(W * .78)), fill=255)
    md.polygon([(int(W * .18), int(W * .58)), (int(W * .5), int(W * .96)), (int(W * .82), int(W * .58))], fill=255)
    body = radial((W, W), (238, 79, 92), (138, 18, 46), center=(0.37, 0.34), radius=0.66).convert("RGBA")
    body.putalpha(body_mask)
    img = Image.alpha_composite(img, body)
    d = ImageDraw.Draw(img)
    rng = random.Random(5)
    # seeds
    for row in range(9):
        for col in range(9):
            x = W * (0.28 + col * 0.055) + (0.012 * W if row % 2 else 0)
            y = W * (0.32 + row * 0.062)
            if math.hypot((x - W * .5) / (W * .33), (y - W * .58) / (W * .38)) < 1 and y < W * .87:
                rw, rh = 2.6 * ss, 4.6 * ss
                d.ellipse((x - rw, y - rh, x + rw, y + rh), fill=(255, 226, 140, 235))
                d.ellipse((x - rw * .4, y - rh * .4, x + rw * .4, y + rh * .4), fill=(184, 137, 52, 160))
    # highlight
    hi = Image.new("RGBA", (W, W), (0, 0, 0, 0))
    hd = ImageDraw.Draw(hi)
    hd.ellipse((int(W * .27), int(W * .32), int(W * .44), int(W * .6)), fill=(255, 255, 255, 55))
    hi = hi.filter(ImageFilter.GaussianBlur(10 * ss))
    img = Image.alpha_composite(img, hi)
    d = ImageDraw.Draw(img)
    # leaves
    for i, ang in enumerate([-1.15, -0.55, 0.1, 0.62, 1.15]):
        cx, cy = W * .5, W * .27
        length, wid = W * .34, W * .16
        pts = []
        for step in range(26):
            t = step / 25
            x = (t - 0.5) * length
            y = -math.sin(math.pi * t) * wid * 0.5
            ca, sa = math.cos(ang - 1.57), math.sin(ang - 1.57)
            pts.append((cx + x * ca - y * sa, cy + x * sa + y * ca))
        for step in range(25, -1, -1):
            t = step / 25
            x = (t - 0.5) * length
            y = math.sin(math.pi * t) * wid * 0.5
            ca, sa = math.cos(ang - 1.57), math.sin(ang - 1.57)
            pts.append((cx + x * ca - y * sa, cy + x * sa + y * ca))
        d.polygon(pts, fill=(56, 108, 42, 255), outline=(36, 74, 29, 255))
    d.line((int(W * .48), int(W * .28), int(W * .45), int(W * .15)), fill=(52, 91, 35, 255), width=int(7 * ss))
    return img, ss


def strawberry():
    img, s = strawberry_whole(700)
    img.resize((700, 700), Image.Resampling.LANCZOS).save(ensure("fruit") / "strawberry-a.png", "PNG", optimize=True)
    print("wrote strawberry-a.png 700x700")

    # half-cut berry + smaller whole beside it
    ss = 3
    W = 700 * ss
    canvas = Image.new("RGBA", (W, W), (0, 0, 0, 0))
    whole, ws = strawberry_whole(430)
    whole = whole.resize((int(whole.width / ws * ss * .46), int(whole.height / ws * ss * .46)), Image.Resampling.LANCZOS)
    canvas.alpha_composite(whole, (int(W * .45), int(W * .3)))
    # cut face
    face = Image.new("RGBA", (W, W), (0, 0, 0, 0))
    d = ImageDraw.Draw(face)
    cx, cy = W * .36, W * .58
    rx, ry = W * .27, W * .3
    d.ellipse((cx - rx, cy - ry, cx + rx, cy + ry), fill=(247, 213, 213, 255))
    d.ellipse((cx - rx * .86, cy - ry * .86, cx + rx * .86, cy + ry * .86), fill=(238, 167, 169, 255))
    d.ellipse((cx - rx * .62, cy - ry * .62, cx + rx * .62, cy + ry * .62), fill=(250, 227, 222, 255))
    d.ellipse((cx - rx * .26, cy - ry * .3, cx + rx * .26, cy + ry * .3), fill=(221, 108, 119, 225))
    # outer red rind
    rind = Image.new("RGBA", (W, W), (0, 0, 0, 0))
    rd = ImageDraw.Draw(rind)
    rd.ellipse((cx - rx, cy - ry, cx + rx, cy + ry), outline=(180, 31, 57, 255), width=int(20 * ss))
    rd.ellipse((cx - rx, cy - ry, cx + rx, cy + ry), outline=(226, 75, 87, 255), width=int(9 * ss))
    canvas = Image.alpha_composite(canvas, rind)
    canvas = Image.alpha_composite(canvas, face)
    # seeds on face
    d = ImageDraw.Draw(canvas)
    rng = random.Random(15)
    for i in range(28):
        ang = rng.uniform(0, math.tau)
        rad = math.sqrt(rng.uniform(0, .82))
        x = cx + math.cos(ang) * rad * rx * .82
        y = cy + math.sin(ang) * rad * ry * .82
        rr = rng.uniform(2.2, 3.4) * ss
        d.ellipse((x - rr, y - rr * 1.5, x + rr, y + rr * 1.5), fill=(231, 190, 122, 230))
    # little leaves on cut berry top
    for ang in (-1.2, -0.3, 0.7):
        px, py = cx, cy - ry * .93
        length, wid = W * .18, W * .07
        pts = []
        for step in range(20):
            t = step / 19
            x = (t - 0.5) * length
            y = -math.sin(math.pi * t) * wid * 0.5
            ca, sa = math.cos(ang - 1.57), math.sin(ang - 1.57)
            pts.append((px + x * ca - y * sa, py + x * sa + y * ca))
        for step in range(19, -1, -1):
            t = step / 19
            x = (t - 0.5) * length
            y = math.sin(math.pi * t) * wid * 0.5
            ca, sa = math.cos(ang - 1.57), math.sin(ang - 1.57)
            pts.append((px + x * ca - y * sa, py + x * sa + y * ca))
        d.polygon(pts, fill=(56, 108, 42, 255), outline=(36, 74, 29, 255))
    canvas.resize((700, 700), Image.Resampling.LANCZOS).save(ensure("fruit") / "strawberry-b.png", "PNG", optimize=True)
    print("wrote strawberry-b.png 700x700")


def die_cut(art, border, pad=0):
    alpha = art.getchannel("A")
    grown = alpha.filter(ImageFilter.MaxFilter(border * 2 + 1))
    white = Image.new("RGBA", art.size, (255, 255, 255, 0))
    white.putalpha(grown)
    white = Image.alpha_composite(white, art)
    return white


def sticker_cat():
    size, ss = 400, 4
    W = size * ss
    img = Image.new("RGBA", (W, W), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    cx, cy = W * .5, W * .55
    r = W * .3
    # ears
    d.polygon([(cx - r * .9, cy - r * .55), (cx - r * .75, cy - r * 1.25), (cx - r * .2, cy - r * .83)], fill=(151, 158, 162, 255))
    d.polygon([(cx + r * .9, cy - r * .55), (cx + r * .75, cy - r * 1.25), (cx + r * .2, cy - r * .83)], fill=(151, 158, 162, 255))
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(173, 179, 182, 255))
    # white blaze
    d.ellipse((cx - r * .34, cy - r * .62, cx + r * .34, cy + r * .86), fill=(241, 240, 234, 255))
    d.ellipse((cx - r * .55, cy + r * .1, cx - r * .12, cy + r * .6), fill=(241, 240, 234, 255))
    d.ellipse((cx + r * .12, cy + r * .1, cx + r * .55, cy + r * .6), fill=(241, 240, 234, 255))
    # eyes
    for sign in (-1, 1):
        ex = cx + sign * r * .42
        d.ellipse((ex - r * .11, cy - r * .18, ex + r * .11, cy + r * .1), fill=(44, 61, 46, 255))
        d.ellipse((ex - r * .045, cy - r * .1, ex + r * .015, cy - r * .02), fill=(255, 255, 255, 255))
    # nose + mouth
    d.polygon([(cx - r * .08, cy + r * .2), (cx + r * .08, cy + r * .2), (cx, cy + r * .3)], fill=(214, 141, 155, 255))
    d.line((cx, cy + r * .3, cx, cy + r * .4), fill=(60, 58, 55, 255), width=int(4 * ss))
    d.arc((cx - r * .18, cy + r * .26, cx, cy + r * .5), 0, 100, fill=(60, 58, 55, 255), width=int(4 * ss))
    d.arc((cx, cy + r * .26, cx + r * .18, cy + r * .5), 80, 180, fill=(60, 58, 55, 255), width=int(4 * ss))
    # whiskers
    for sign in (-1, 1):
        for k, yy in enumerate([-.02, .09, .2]):
            d.line((cx + sign * r * .35, cy + r * yy, cx + sign * r * .85, cy + r * (yy - .08)), fill=(95, 101, 98, 170), width=int(3 * ss))
    img = die_cut(img, int(10 * ss))
    save_aa(img, ss, ensure("stickers") / "sticker-cat.png")


def sticker_bow():
    size, ss = 400, 4
    W = size * ss
    img = Image.new("RGBA", (W, W), (0, 0, 0, 0))
    art = Image.new("RGBA", (W, W), (0, 0, 0, 0))
    d = ImageDraw.Draw(art)
    cx, cy = W * .5, W * .5
    green = (76, 128, 60, 255)
    dark = (49, 92, 43, 255)
    # tails
    d.polygon([(cx - W * .04, cy + W * .02), (cx - W * .2, cy + W * .33), (cx - W * .05, cy + W * .26)], fill=dark)
    d.polygon([(cx + W * .04, cy + W * .02), (cx + W * .2, cy + W * .33), (cx + W * .05, cy + W * .26)], fill=dark)
    # loops
    d.ellipse((cx - W * .33, cy - W * .22, cx - W * .02, cy + W * .18), fill=green)
    d.ellipse((cx + W * .02, cy - W * .22, cx + W * .33, cy + W * .18), fill=green)
    d.ellipse((cx - W * .27, cy - W * .16, cx - W * .07, cy + W * .11), fill=(101, 153, 80, 255))
    d.ellipse((cx + W * .07, cy - W * .16, cx + W * .27, cy + W * .11), fill=(101, 153, 80, 255))
    d.ellipse((cx - W * .1, cy - W * .1, cx + W * .1, cy + W * .1), fill=green)
    # gingham grid, clipped to the bow silhouette
    mask = art.getchannel("A")
    grid = Image.new("RGBA", (W, W), (0, 0, 0, 0))
    gd = ImageDraw.Draw(grid)
    step = W * .055
    for i in range(-30, 60):
        gd.line((i * step, 0, i * step + W, W), fill=(255, 255, 255, 110), width=int(4 * ss))
        gd.line((i * step, W, i * step + W, 0), fill=(255, 255, 255, 110), width=int(4 * ss))
    grid.putalpha(Image.composite(grid.getchannel("A"), Image.new("L", (W, W), 0), mask))
    art = Image.alpha_composite(art, grid)
    # outline
    d = ImageDraw.Draw(art)
    art = die_cut(art, int(9 * ss))
    save_aa(art, ss, ensure("stickers") / "sticker-bow.png")


def sticker_gummy():
    size, ss = 400, 4
    W = size * ss
    art = Image.new("RGBA", (W, W), (0, 0, 0, 0))
    d = ImageDraw.Draw(art)
    cx, cy = W * .5, W * .53
    body = (246, 248, 244, 210)
    edge = (219, 231, 220, 235)
    # legs, arms, body, head, ears
    d.rounded_rectangle((cx - W * .18, cy + W * .08, cx - W * .04, cy + W * .32), radius=W * .05, fill=body, outline=edge, width=int(4 * ss))
    d.rounded_rectangle((cx + W * .04, cy + W * .08, cx + W * .18, cy + W * .32), radius=W * .05, fill=body, outline=edge, width=int(4 * ss))
    d.rounded_rectangle((cx - W * .25, cy - W * .02, cx - W * .16, cy + W * .2), radius=W * .04, fill=body, outline=edge, width=int(4 * ss))
    d.rounded_rectangle((cx + W * .16, cy - W * .02, cx + W * .25, cy + W * .2), radius=W * .04, fill=body, outline=edge, width=int(4 * ss))
    d.ellipse((cx - W * .22, cy - W * .05, cx + W * .22, cy + W * .28), fill=body, outline=edge, width=int(4 * ss))
    d.ellipse((cx - W * .18, cy - W * .3, cx + W * .18, cy + W * .02), fill=body, outline=edge, width=int(4 * ss))
    d.ellipse((cx - W * .18, cy - W * .34, cx - W * .08, cy - W * .2), fill=body, outline=edge, width=int(4 * ss))
    d.ellipse((cx + W * .08, cy - W * .34, cx + W * .18, cy - W * .2), fill=body, outline=edge, width=int(4 * ss))
    # face
    for sign in (-1, 1):
        d.ellipse((cx + sign * W * .09 - W * .02, cy - W * .17, cx + sign * W * .09 + W * .02, cy - W * .1), fill=(78, 91, 74, 220))
    d.arc((cx - W * .05, cy - W * .12, cx + W * .05, cy - W * .03), 15, 165, fill=(78, 91, 74, 220), width=int(3.5 * ss))
    # gloss
    gloss = Image.new("RGBA", (W, W), (0, 0, 0, 0))
    gd = ImageDraw.Draw(gloss)
    gd.ellipse((cx - W * .15, cy - W * .26, cx - W * .06, cy - W * .12), fill=(255, 255, 255, 150))
    gd.ellipse((cx - W * .16, cy + W * .02, cx - W * .1, cy + W * .17), fill=(255, 255, 255, 95))
    gloss = gloss.filter(ImageFilter.GaussianBlur(4 * ss))
    art = Image.alpha_composite(art, Image.composite(gloss, Image.new("RGBA", (W, W), (0, 0, 0, 0)), art.getchannel("A")))
    art = die_cut(art, int(10 * ss))
    save_aa(art, ss, ensure("stickers") / "sticker-gummy.png")


def sticker_matcha():
    size, ss = 400, 4
    W = size * ss
    art = Image.new("RGBA", (W, W), (0, 0, 0, 0))
    d = ImageDraw.Draw(art)
    cx, cy, r = W * .5, W * .5, W * .37
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(61, 99, 42, 255), outline=(29, 48, 23, 255), width=int(7 * ss))
    for i in range(14):
        ang = i / 14 * math.tau
        length = r * (0.62 if i % 2 else 0.8)
        wid = r * 0.11
        px, py = cx + math.cos(ang) * r * .12, cy + math.sin(ang) * r * .12
        pts = []
        for step in range(18):
            t = step / 17
            x = t * length
            y = -math.sin(math.pi * t) * wid * 0.5
            pts.append((px + x * math.cos(ang) - y * math.sin(ang), py + x * math.sin(ang) + y * math.cos(ang)))
        for step in range(17, -1, -1):
            t = step / 17
            x = t * length
            y = math.sin(math.pi * t) * wid * 0.5
            pts.append((px + x * math.cos(ang) - y * math.sin(ang), py + x * math.sin(ang) + y * math.cos(ang)))
        d.polygon(pts, fill=(166, 224, 58, 255) if i % 2 else (118, 174, 55, 255))
    d.ellipse((cx - r * .13, cy - r * .13, cx + r * .13, cy + r * .13), fill=(29, 48, 23, 255))
    art = die_cut(art, int(9 * ss))
    save_aa(art, ss, ensure("stickers") / "sticker-matcha.png")


def sticker_label():
    w, h, ss = 600, 300, 3
    W, H = w * ss, h * ss
    art = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(art)
    d.rounded_rectangle((W * .03, H * .12, W * .97, H * .88), radius=int(H * .2), fill=(58, 98, 43, 255))
    d.rounded_rectangle((W * .05, H * .16, W * .95, H * .84), radius=int(H * .17), outline=(236, 238, 205, 255), width=int(4 * ss))
    try:
        font = ImageFont.truetype(str(FONT_DIR / "georgiab.ttf"), int(H * .21))
    except OSError:
        font = ImageFont.truetype(str(FONT_DIR / "georgia.ttf"), int(H * .21))
    text = "Matcha Girlie"
    box = d.textbbox((0, 0), text, font=font)
    tw, th = box[2] - box[0], box[3] - box[1]
    d.text(((W - tw) / 2 - box[0], (H - th) / 2 - box[1] - H * .01), text, font=font, fill=(247, 243, 222, 255))
    # tiny lime leaf
    d.ellipse((W * .09, H * .45, W * .12, H * .61), fill=(166, 224, 58, 255))
    art = die_cut(art, int(8 * ss))
    save_aa(art, ss, ensure("stickers") / "sticker-label.png")


def social_icons():
    ss = 4
    size = 128
    W = size * ss

    def base():
        return Image.new("RGBA", (W, W), (0, 0, 0, 0))

    def output(img, name):
        img.resize((size, size), Image.Resampling.LANCZOS).save(ensure("social") / name, "PNG", optimize=True)
        print(f"wrote {name} 128x128")

    # facebook
    img = base(); d = ImageDraw.Draw(img)
    font = ImageFont.truetype(str(FONT_DIR / "arialbd.ttf"), int(W * .84))
    box = d.textbbox((0, 0), "f", font=font)
    d.text(((W - (box[2] - box[0])) / 2 - box[0], (W - (box[3] - box[1])) / 2 - box[1] - W * .04), "f", font=font, fill=(255, 255, 255, 255))
    output(img, "icon-facebook.png")

    # instagram
    img = base(); d = ImageDraw.Draw(img)
    d.rounded_rectangle((W * .16, W * .16, W * .84, W * .84), radius=int(W * .22), outline=(255, 255, 255, 255), width=int(6 * ss))
    d.ellipse((W * .35, W * .35, W * .65, W * .65), outline=(255, 255, 255, 255), width=int(6 * ss))
    d.ellipse((W * .68, W * .28, W * .75, W * .35), fill=(255, 255, 255, 255))
    output(img, "icon-instagram.png")

    # youtube
    img = base(); d = ImageDraw.Draw(img)
    d.rounded_rectangle((W * .1, W * .26, W * .9, W * .74), radius=int(W * .16), fill=(255, 255, 255, 255))
    mask = Image.new("L", (W, W), 0)
    md = ImageDraw.Draw(mask)
    md.polygon([(W * .43, W * .37), (W * .43, W * .63), (W * .66, W * .5)], fill=255)
    alpha = img.getchannel("A")
    alpha.paste(0, mask=mask)
    img.putalpha(alpha)
    output(img, "icon-youtube.png")

    # x
    img = base(); d = ImageDraw.Draw(img)
    d.line((W * .2, W * .2, W * .8, W * .8), fill=(255, 255, 255, 255), width=int(11 * ss))
    d.line((W * .8, W * .2, W * .2, W * .8), fill=(255, 255, 255, 255), width=int(11 * ss))
    output(img, "icon-x.png")


def hero_cups():
    if not (ROOT / "products" / "drink-hazelnut.png").exists():
        return
    w, h = 2200, 1500
    canvas = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    hazel = Image.open(ROOT / "products" / "drink-hazelnut.png").convert("RGBA")
    berry = Image.open(ROOT / "products" / "drink-strawberry.png").convert("RGBA")

    def sized(im, height):
        return im.resize((int(im.width * height / im.height), height), Image.Resampling.LANCZOS)

    hazel = sized(hazel, 1080).rotate(-7, expand=True, resample=Image.Resampling.BICUBIC)
    berry = sized(berry, 1020).rotate(7, expand=True, resample=Image.Resampling.BICUBIC)

    # arms / hands painted behind the cups, reaching up from the bottom edge
    arms = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    ad = ImageDraw.Draw(arms)
    skin_dark = (191, 126, 88, 255)
    skin = (221, 160, 117, 255)
    skin_light = (238, 187, 146, 255)
    for sign in (-1, 1):
        cx = w * (.5 + sign * .29)
        top_x = cx - sign * 40
        pts = [(cx - 210, h + 40), (cx + 210, h + 40), (top_x + 118, 860), (top_x - 118, 860)]
        ad.polygon(pts, fill=skin)
        ad.ellipse((top_x - 118, 760, top_x + 118, 1040), fill=skin)
        ad.ellipse((cx - 175, h - 260, cx + 235, h + 80), fill=skin)
        # inner shading
        shade = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        sd = ImageDraw.Draw(shade)
        sd.polygon([(cx - 210, h + 40), (cx - 140, h + 40), (top_x - 60, 900), (top_x - 105, 880)], fill=(156, 96, 65, 80))
        sd.ellipse((top_x - 118 + 70, 790, top_x + 118 + 70, 1030), fill=(247, 206, 172, 90))
        shade = shade.filter(ImageFilter.GaussianBlur(16))
        arms = Image.alpha_composite(arms, shade)
    # finger silhouettes with mint nails, drawn behind the cups (they peek around the sides)
    for sign in (-1, 1):
        cx = w * (.5 + sign * .29)
        for i in range(4):
            fx = cx + sign * (105 + i * 24)
            fy = 820 + i * 18
            ad.rounded_rectangle((fx - 34, fy, fx + 34, fy + 190), radius=34, fill=skin_light)
            ad.ellipse((fx - 27, fy - 8, fx + 27, fy + 58), fill=(181, 226, 196, 255))
    canvas = Image.alpha_composite(canvas, arms)

    canvas.alpha_composite(hazel, (int(w * .19 - hazel.width / 2 + 90), int(h * .06)))
    canvas.alpha_composite(berry, (int(w * .80 - berry.width / 2 - 70), int(h * .09)))

    # front fingers gripping the cups + mint nails
    front = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    fd = ImageDraw.Draw(front)
    lx, ly = w * .305, 930
    rx, ry = w * .695, 930
    for i in range(4):
        fd.rounded_rectangle((lx - 42 + i * 26, ly + i * 13, lx + 20 + i * 26, ly + 150 + i * 13), radius=38, fill=skin_light)
        fd.ellipse((lx - 30 + i * 26, ly + 96 + i * 13, lx + 8 + i * 26, ly + 136 + i * 13), fill=(181, 226, 196, 255))
    for i in range(4):
        fd.rounded_rectangle((rx - 75 - i * 26, ry + i * 13, rx - 13 - i * 26, ry + 150 + i * 13), radius=38, fill=skin_light)
        fd.ellipse((rx - 63 - i * 26, ry + 96 + i * 13, rx - 25 - i * 26, ry + 136 + i * 13), fill=(181, 226, 196, 255))
    front = front.filter(ImageFilter.GaussianBlur(0.6))
    canvas = Image.alpha_composite(canvas, front)
    out = canvas.resize((1800, 1227), Image.Resampling.LANCZOS)
    out.save(ensure("hero") / "hero-cups.webp", "WEBP", quality=86, method=2)
    print(f"wrote hero-cups.webp {out.width}x{out.height}")


def verify():
    solid_bottom = {"hero-hill.png", "wave-edge.png"}
    for path in [*ROOT.rglob("*.png"), *ROOT.rglob("*.webp")]:
        with Image.open(path) as im:
            if im.mode != "RGBA":
                print(f"{path.relative_to(ROOT)}: {im.size} mode={im.mode}")
                continue
            points = [(0, 0), (im.width - 1, 0)]
            if path.name not in solid_bottom:
                points += [(0, im.height - 1), (im.width - 1, im.height - 1)]
            corners = [im.getpixel(p)[3] for p in points]
            alpha = im.getchannel("A")
            bbox = alpha.getbbox()
            if any(corners):
                raise SystemExit(f"Non-transparent corner in {path}: {corners}")
            if bbox is None:
                raise SystemExit(f"Fully transparent asset: {path}")
            print(f"{path.relative_to(ROOT)}: {im.size} alpha corners={corners} bbox={bbox}")


if __name__ == "__main__":
    hill()
    wave()
    whisk()
    cursor()
    leaves()
    strawberry()
    sticker_cat()
    sticker_bow()
    sticker_gummy()
    sticker_matcha()
    sticker_label()
    social_icons()
    hero_cups()
    verify()
