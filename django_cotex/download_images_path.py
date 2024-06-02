import os
import sys
import django
import requests

# Adjust the path to your Django project settings
sys.path.append("C:\\Users\\friv1\\Desktop\\github projects\\cotex\\django_cotex")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "cotex.settings")
django.setup()

from myapp.models import Game

def download_and_save_images():
    games = Game.objects.all()

    for game in games:
        image_url = game.image_url  # Assuming image_url is a field in your Game model
        
        if image_url:
            try:
                # Check if image already exists
                image_dir = 'media/game_images/'  # Change this directory path as needed
                image_name = image_url.split('/')[-1]
                image_path = os.path.join(image_dir, image_name)
                
                if os.path.exists(image_path):
                    print(f"Image for {game.title} already exists. Skipping download.")
                else:
                    response = requests.get(image_url)
                    if response.status_code == 200:
                        # Create directory if it doesn't exist
                        os.makedirs(image_dir, exist_ok=True)
                        
                        # Save image to file system
                        with open(image_path, 'wb') as f:
                            f.write(response.content)

                        # Update image_path field in the database
                        game.image_path = image_path
                        game.save()

                        print(f"Image for {game.title} saved successfully.")
                    else:
                        print(f"Failed to download image for {game.title}. Status code: {response.status_code}")
            except Exception as e:
                print(f"Error downloading image for {game.title}: {str(e)}")
        else:
            print(f"No image URL found for {game.title}.")

if __name__ == "__main__":
    download_and_save_images()
