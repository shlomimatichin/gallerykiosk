from io import BytesIO
import cairosvg
from PIL import Image
import os

out = BytesIO()
cairosvg.svg2png(url='assets/ic_launcher.svg', write_to=out)
image = Image.open(out)
print("Original:", image.size)
assert image.size[0] == image.size[1]
scale = 2000 // image.size[0]
out = BytesIO()
cairosvg.svg2png(url='assets/ic_launcher.svg', write_to=out, scale=scale)
image = Image.open(out)
print("Scaled:", scale, image.size)


for root, dirs, filenames in os.walk("platforms/android"):
    for filename in filenames:
        if filename not in ['ic_launcher.png', 'ic_launcher_foreground.png']:
            continue
        fullname = os.path.join(root, filename)
        with open(fullname, "rb") as reader:
            to_replace = Image.open(reader)
        width, height = to_replace.size
        print(f"Opened {fullname}: {width}X{height}")
        assert width == height
        resized = image.resize([width, height], resample=Image.LANCZOS)
        resized.save(fullname)

