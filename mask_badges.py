import os
from PIL import Image, ImageDraw

def make_circular_transparent(img_path, output_path):
    print(f"Processing {img_path}")
    img = Image.open(img_path).convert("RGBA")
    
    # Create a circular mask
    mask = Image.new("L", img.size, 0)
    draw = ImageDraw.Draw(mask)
    
    # The images are 1024x1024. Let's make a circle slightly smaller than the full width
    width, height = img.size
    margin = int(width * 0.05) # 5% margin
    bbox = (margin, margin, width - margin, height - margin)
    
    draw.ellipse(bbox, fill=255)
    
    # Apply mask to image
    img.putalpha(mask)
    
    # Save the image
    img.save(output_path, "PNG")

directory = "public/images/badges"
for filename in os.listdir(directory):
    if filename.endswith(".png"):
        img_path = os.path.join(directory, filename)
        make_circular_transparent(img_path, img_path)
print("Done!")
