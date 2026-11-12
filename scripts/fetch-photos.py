"""Fetch real, openly licensed photographs from Openverse for the Greenleaf site.

Downloads candidates into a staging folder and prints simple metrics so the
best shot for each subject can be chosen without opening each file.

Run: python scripts/fetch-photos.py [subject ...]
"""
import json
import os
import sys
import urllib.parse
import urllib.request
from pathlib import Path

from PIL import Image
import numpy as np

STAGE = Path(os.environ.get("TEMP", "/tmp")) / "opencode" / "photos"
UA = "mr-coffee-site/1.0 (educational demo; contact: dev@example.com)"

QUERIES = {
    "sky": ["blue sky white clouds",
            "sky clouds"],
    "matcha-latte": ["iced matcha latte",
                     "matcha latte glass"],
    "matcha-cup": ["matcha latte cup white background",
                   "matcha drink isolated"],
    "strawberry-matcha": ["strawberry matcha latte",
                          "strawberry matcha drink"],
    "/strawberry": ["strawberry isolated white background",
                    "fresh strawberry"],
    "matcha-powder": ["matcha powder bowl",
                      "matcha green tea powder"],
    "tea-leaves": ["green tea leaves plant",
                   "tea leaves fresh green"],
    "whisk": ["matcha whisk bowl",
              "bamboo whisk chasen"],
    "matcha-top": ["matcha bowl top view",
                   "matcha latte top view"],
    "matcha-field": ["matcha tea field green",
                     "green tea plantation"],
}


def query(term, page_size=20):
    url = ("https://api.openverse.org/v1/images/?"
           + urllib.parse.urlencode({
               "q": term,
               "page_size": page_size,
               "license_type": "all-cc,commercial",
           }))
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=40) as resp:
        return json.loads(resp.read().decode("utf-8"))


def download(url, dest):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = resp.read()
    dest.write_bytes(data)
    return len(data)


def metrics(path):
    try:
        im = Image.open(path).convert("RGB")
    except Exception as exc:  # noqa: BLE001
        return f"unreadable ({exc})"
    im.thumbnail((320, 320))
    a = np.asarray(im, dtype=np.float32)
    h, w, _ = a.shape
    border = np.concatenate([
        a[:4].reshape(-1, 3), a[-4:].reshape(-1, 3),
        a[:, :4].reshape(-1, 3), a[:, -4:].reshape(-1, 3),
    ])
    bmean = border.mean(axis=0)
    bstd = border.std(axis=0).mean()
    mean = a.reshape(-1, 3).mean(axis=0)
    flatness = 1.0 - min(1.0, bstd / 64.0)
    return (f"{im.width}x{im.height} mean={mean.round().astype(int)} "
            f"border={bmean.round().astype(int)} borderStd={bstd:.0f} flat={flatness:.2f}")


def main(subjects):
    STAGE.mkdir(parents=True, exist_ok=True)
    for subject in subjects:
        terms = QUERIES.get(subject, [subject.replace("-", " ")])
        out = STAGE / subject.strip("/")
        out.mkdir(parents=True, exist_ok=True)
        seen = set()
        index = 0
        for term in terms:
            try:
                data = query(term)
            except Exception as exc:  # noqa: BLE001
                print(f"[{subject}] query failed: {exc}")
                continue
            for result in data.get("results", []):
                url = result.get("url")
                if not url or url in seen:
                    continue
                seen.add(url)
                ext = ".jpg"
                for candidate in (".jpg", ".jpeg", ".png", ".webp"):
                    if url.lower().split("?")[0].endswith(candidate):
                        ext = candidate
                        break
                index += 1
                dest = out / f"{index:02d}{ext}"
                try:
                    size = download(url, dest)
                except Exception as exc:  # noqa: BLE001
                    print(f"[{subject}] {index:02d} download failed: {exc}")
                    dest.unlink(missing_ok=True)
                    continue
                print(f"[{subject}] {dest.name} {size // 1024}KB "
                      f"{metrics(dest)} src={url}")
        print(f"[{subject}] staged in {out}")


if __name__ == "__main__":
    main(sys.argv[1:] or list(QUERIES))
