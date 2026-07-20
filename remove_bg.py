import os
import glob
from rembg import remove
from PIL import Image

artifacts_dir = "/home/levi07/.gemini/antigravity-ide/brain/8ee2b5a9-fdbe-4e0e-8095-9e384258199e/"
dest_dir = "public/images/badges/"

mapping = {
    "badge_100_total_*.png": "100-days-total.png",
    "badge_150_streak_*.png": "150-days-streak.png",
    "badge_1_streak_*.png": "1-day-streak.png",
    "badge_200_total_*.png": "200-days-total.png",
    "badge_210_streak_*.png": "210-days-streak.png",
    "badge_300_total_*.png": "300-days-total.png",
    "badge_30_streak_*.png": "30-days-streak.png",
    "badge_50_total_*.png": "50-days-total.png",
    "badge_60_streak_*.png": "60-days-streak.png",
    "badge_90_streak_*.png": "90-days-streak.png",
}

for pattern, dest_name in mapping.items():
    matches = glob.glob(os.path.join(artifacts_dir, pattern))
    if matches:
        matches.sort(key=os.path.getmtime)
        src = matches[-1]
        dest = os.path.join(dest_dir, dest_name)
        
        print(f"Removing bg for {dest_name}...")
        input_image = Image.open(src)
        output_image = remove(input_image)
        output_image.save(dest)

print("Done!")
