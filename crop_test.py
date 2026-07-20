import os
from PIL import Image, ImageDraw

def crop_center_circle(img_path, output_path, scale_factor=0.72, y_offset=0.03):
    print(f"Processing {img_path}")
    img = Image.open(img_path).convert("RGBA")
    width, height = img.size
    
    # We want a circle that is scale_factor of the total height
    radius = int(width * scale_factor / 2)
    center_x = width // 2
    center_y = int(height // 2 + height * y_offset) # slightly lower due to top ribbon
    
    # Create mask
    mask = Image.new("L", (width, height), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((center_x - radius, center_y - radius, center_x + radius, center_y + radius), fill=255)
    
    # Apply mask
    img.putalpha(mask)
    
    # Crop to bounding box of the circle
    bbox = (center_x - radius, center_y - radius, center_x + radius, center_y + radius)
    cropped = img.crop(bbox)
    
    cropped.save(output_path, "PNG")

crop_center_circle("public/images/badges/1-day-streak.png", "test_cropped.png")
print("Done")
