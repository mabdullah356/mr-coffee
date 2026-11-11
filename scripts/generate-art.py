"""Render original raster artwork for the Greenleaf page with Pillow.

These images are locally painted rather than fetched from a stock service or API.
Run: python scripts/generate-art.py
"""
from pathlib import Path
import random

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1] / "src" / "assets" / "images"
random.seed(18)


def sky():
    w, h = 1800, 1100
    im = Image.new("RGB", (w, h))
    top, bottom = (73, 169, 231), (196, 230, 244)
    y = np.linspace(0, 1, h, dtype=np.float32)[:, None, None]
    base = np.array(top, dtype=np.float32)[None, None, :] * (1-y) + np.array(bottom, dtype=np.float32)[None, None, :] * y
    grain = np.random.default_rng(18).integers(-3, 4, (h, w, 1), dtype=np.int16)
    pixels = np.clip(base + grain, 0, 255).astype(np.uint8)
    im = Image.fromarray(pixels, "RGB")
    cloud = Image.new("RGBA", (w, h))
    d = ImageDraw.Draw(cloud)
    for cx, cy, span, strength in [(230, 320, 210, 205), (740, 180, 170, 170), (1330, 280, 250, 190), (1600, 650, 270, 160), (500, 760, 260, 135)]:
        for _ in range(34):
            x = random.gauss(cx, span * .43)
            y = random.gauss(cy, span * .16)
            rx = random.uniform(span * .12, span * .32)
            ry = random.uniform(span * .07, span * .19)
            alpha = random.randint(20, strength)
            d.ellipse((x-rx, y-ry, x+rx, y+ry), fill=(255, 255, 255, alpha))
    cloud = cloud.filter(ImageFilter.GaussianBlur(30))
    im = Image.alpha_composite(im.convert("RGBA"), cloud).convert("RGB")
    d = ImageDraw.Draw(im, "RGBA")
    for cx, cy, size in [(235, 298, 115), (748, 166, 83), (1330, 264, 130), (1590, 638, 148), (500, 747, 140)]:
        d.ellipse((cx-size, cy-size*.28, cx+size, cy+size*.28), fill=(255,255,255,22))
    im.save(ROOT / "hero" / "hero-sky.webp", "WEBP", quality=88, method=6)


def drink(filename, berry=False):
    w, h = 960, 1560
    mask = Image.new("L", (w, h), 0)
    md = ImageDraw.Draw(mask)
    md.polygon([(228, 150), (732, 150), (668, 1428), (292, 1428)], fill=255)
    md.ellipse((228, 103, 732, 197), fill=255)

    art = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    glass = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    xs = np.arange(w, dtype=np.float32)[None, :]
    ys = np.arange(h, dtype=np.float32)[:, None]
    shape_mask = np.asarray(mask) > 0
    edge = np.abs(xs - (480 + (ys - 150) * .15)) / 260
    glass_pixels = np.zeros((h,w,4), dtype=np.uint8)
    glass_pixels[:,:,:3] = (239,252,232)
    glass_pixels[:,:,3] = np.where(shape_mask, np.maximum(15, np.clip(66-edge*25,0,255).astype(np.uint8)), 0)
    glass = Image.fromarray(glass_pixels, "RGBA")
    art = Image.alpha_composite(art, glass)

    liquid = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    t = np.clip((ys - 188) / 1238, 0, 1)
    if berry:
        u = np.clip(t/.39,0,1); matcha = np.stack([94+39*u,131+30*u,53+19*u],axis=-1)
        u = np.clip((t-.39)/.37,0,1); milk = np.stack([239+11*u,235+11*u,213+13*u],axis=-1)
        u = np.clip((t-.76)/.24,0,1); fruit = np.stack([181+50*u,48+43*u,68+37*u],axis=-1)
        colors = np.where((t<.39)[:,:,None], matcha, np.where((t<.76)[:,:,None],milk,fruit))
    else:
        u = np.clip(t/.61,0,1); matcha = np.stack([79+66*u,119+51*u,43+41*u],axis=-1)
        u = np.clip((t-.61)/.39,0,1); milk = np.stack([236+16*u,231+17*u,208+21*u],axis=-1)
        colors = np.where((t<.61)[:,:,None],matcha,milk)
    shine = np.maximum(0,1-np.abs(xs-337)/92)*18
    pattern = ((xs+ys*.31).astype(np.int32)%8-4)
    rgb = np.clip(colors + shine[:,:,None] + pattern[:,:,None],0,255).astype(np.uint8)
    liquid_pixels=np.zeros((h,w,4),dtype=np.uint8)
    liquid_pixels[:,:,:3]=rgb
    liquid_pixels[:,:,3]=np.where(shape_mask & (ys>=188) & (ys<=1426),239,0)
    liquid = Image.fromarray(liquid_pixels,"RGBA")
    art = Image.alpha_composite(art, liquid)

    d = ImageDraw.Draw(art, "RGBA")
    # Subtle soft milk and matcha swirls just under the ice.
    if not berry:
        d.arc((290, 170, 675, 390), 185, 350, fill=(212, 235, 158, 125), width=19)
    else:
        d.arc((285, 190, 660, 395), 190, 345, fill=(220, 236, 177, 130), width=16)
    for x, y, a in [(357, 283, 85), (514, 240, 75), (601, 341, 65), (433, 405, 50)]:
        points = [(x-42,y-34),(x+35,y-43),(x+47,y+20),(x+5,y+48),(x-39,y+11)]
        d.polygon(points, fill=(224, 251, 235, a), outline=(255,255,255,170))
        d.line((x-33,y-29,x+31,y+33), fill=(255,255,255,150), width=4)
    # Front glass glints and delicate rim; fully transparent background remains intact.
    d.line([(260, 270), (282, 1200)], fill=(255,255,255,178), width=18)
    d.line([(294, 230), (307, 760)], fill=(255,255,255,80), width=7)
    d.line([(701, 260), (649, 1250)], fill=(255,255,255,125), width=12)
    d.ellipse((222, 109, 738, 206), outline=(255,255,255,225), width=9)
    d.arc((294, 1340, 666, 1478), 0, 180, fill=(255,255,255,195), width=8)
    d.ellipse((434, 695, 526, 787), fill=(245, 246, 217, 82), outline=(255,255,255,145), width=4)
    # Condensation points.
    for x, y in [(293,480),(640,555),(339,916),(614,1074),(371,1230),(586,735)]:
        d.ellipse((x-5,y-7,x+5,y+7), fill=(255,255,255,105))
    art.save(ROOT / "products" / filename, "PNG", optimize=True)


def leaves():
    size = 720
    im = Image.new("RGBA", (size, size), (0,0,0,0))
    d = ImageDraw.Draw(im)
    d.line([(150,610),(298,405),(430,226),(564,90)], fill=(42,67,33,220), width=8, joint="curve")
    specs = [(205,520,-40,155,70),(300,405,140,170,72),(400,275,-38,190,82),(510,145,145,185,75)]
    for x,y,angle,l,w in specs:
        leaf = Image.new("RGBA", (l+30,w+30), (0,0,0,0)); ld=ImageDraw.Draw(leaf)
        ld.ellipse((4,4,l+20,w+20), outline=(42,67,33,225), width=7)
        ld.line((12,(w+30)//2,l+14,(w+30)//2), fill=(42,67,33,185), width=5)
        for t in (.27,.48,.68):
            xx=12+int(l*t); yy=(w+30)//2
            ld.line((xx,yy,xx-int(w*.18),yy-int(w*.25)), fill=(42,67,33,145), width=3)
            ld.line((xx,yy,xx+int(w*.13),yy+int(w*.28)), fill=(42,67,33,145), width=3)
        leaf=leaf.rotate(angle, expand=True, resample=Image.Resampling.BICUBIC)
        im.alpha_composite(leaf, (max(0,min(size-leaf.width,x-leaf.width//2)), max(0,min(size-leaf.height,y-leaf.height//2))) )
    im.save(ROOT / "leaves" / "leaf-branch.png", optimize=True)


def powder():
    w,h=1500,950
    xx,yy=np.meshgrid(np.arange(w),np.arange(h))
    glow=np.maximum(0,1-np.sqrt(((xx-1120)/850)**2+((yy-820)/690)**2))
    noise=np.random.default_rng(24).integers(-4,5,(h,w),dtype=np.int16)
    base=np.stack([17+glow*6,24+glow*8,17+glow*3],axis=-1)
    im=Image.fromarray(np.clip(base+noise[:,:,None],0,255).astype(np.uint8),"RGB")
    mound=Image.new("RGBA",(w,h),(0,0,0,0)); d=ImageDraw.Draw(mound)
    d.ellipse((620,430,1570,1230),fill=(52,93,37,255))
    d.ellipse((750,458,1510,970),fill=(105,151,46,255))
    d.ellipse((825,480,1430,835),fill=(143,184,57,245))
    mound=mound.filter(ImageFilter.GaussianBlur(18)); im=Image.alpha_composite(im.convert("RGBA"),mound)
    d=ImageDraw.Draw(im,"RGBA")
    for _ in range(11500):
        x=random.randint(690,1510); y=random.randint(480,900)
        if ((x-1110)/430)**2+((y-690)/210)**2<1:
            r=random.choice([1,1,2,3]); c=random.choice([(189,220,92,95),(38,77,27,80),(220,238,145,55)])
            d.ellipse((x-r,y-r,x+r,y+r),fill=c)
    im.convert("RGB").save(ROOT / "footer" / "matcha-powder.webp", "WEBP", quality=87, method=6)


def brand():
    im=Image.new("RGBA",(256,256),(0,0,0,0)); d=ImageDraw.Draw(im)
    d.ellipse((8,8,248,248),fill=(41,53,30,255),outline=(251,247,235,255),width=8)
    d.ellipse((20,20,236,236),outline=(166,224,58,210),width=3)
    d.ellipse((107,63,151,190),fill=(166,224,58,255))
    d.polygon([(127,69),(78,112),(114,132),(127,126)],fill=(166,224,58,255))
    d.polygon([(132,111),(179,137),(143,152),(132,146)],fill=(166,224,58,255))
    d.line((128,77,128,186),fill=(41,53,30,230),width=5)
    im.save(ROOT / "brand" / "brand-mark.png", optimize=True)
    im.resize((64,64),Image.Resampling.LANCZOS).save(Path(__file__).resolve().parents[1]/"public"/"favicon.png", optimize=True)


for folder in ("hero", "products", "footer", "leaves", "brand"):
    (ROOT/folder).mkdir(parents=True, exist_ok=True)
sky()
drink("drink-hazelnut.png")
drink("drink-strawberry.png", berry=True)
leaves()
powder()
brand()

for image_path in ROOT.rglob("*.png"):
    with Image.open(image_path) as image:
        if image.mode == "RGBA":
            corners = [image.getpixel(point)[3] for point in ((0,0),(image.width-1,0),(0,image.height-1),(image.width-1,image.height-1))]
            print(f"{image_path.relative_to(ROOT)}: {image.size}, alpha corners={corners}")
            if any(corners):
                raise SystemExit(f"Non-transparent corner detected in {image_path}")
        else:
            print(f"{image_path.relative_to(ROOT)}: {image.size}, mode={image.mode}")
