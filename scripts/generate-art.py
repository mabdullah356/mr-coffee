"""Render decorative raster artwork for Greenleaf with Pillow.

Photographic hero and drink assets are maintained separately.
Run: python scripts/generate-art.py
"""
from pathlib import Path
import random

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1] / "src" / "assets" / "images"
random.seed(18)


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
