import os
from PIL import Image, ImageDraw

img = Image.open("public/images/badges/200-days-total.png").convert("RGBA")
width, height = img.size

# The inner circle radius. Let's try 0.55 scale (which means zooming by 1/0.55 = 1.8)
scale_factor = 0.55
radius = int(width * scale_factor / 2)
center_x = width // 2
center_y = int(height // 2 + height * 0.02) # slight y offset

mask = Image.new("L", (width, height), 0)
draw = ImageDraw.Draw(mask)
draw.ellipse((center_x - radius, center_y - radius, center_x + radius, center_y + radius), fill=255)

img.putalpha(mask)
bbox = (center_x - radius, center_y - radius, center_x + radius, center_y + radius)
cropped = img.crop(bbox)

# Add a grey border to the image to simulate CSS
bordered = Image.new("RGBA", (cropped.width + 20, cropped.height + 20), (0,0,0,0))
draw_border = ImageDraw.Draw(bordered)
draw_border.ellipse((0, 0, bordered.width-1, bordered.height-1), fill=(148, 163, 184, 255))
bordered.paste(cropped, (10, 10), cropped)

bordered.save("/home/levi07/.gemini/antigravity-ide/brain/8ee2b5a9-fdbe-4e0e-8095-9e384258199e/test_tight_crop.png")
print("Saved test_tight_crop.png")
