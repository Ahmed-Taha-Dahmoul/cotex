import os
import sys
import django
import requests
import time
from urllib.parse import urlparse, urlunparse

# Adjust the path to your Django project settings
sys.path.append("C:\\Users\\friv1\\Desktop\\github projects\\cotex\\django_cotex")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "cotex.settings")
django.setup()

from myapp.models import GameOnline  # Adjust the import based on your actual app name and model

def download_and_save_images():
    games = GameOnline.objects.all()  # Fetch all GameOnline records

    for game in games:
        image_url = game.image_url  # Assuming image_url is a field in your GameOnline model

        if image_url:
            try:
                # Check if image_path is not null (meaning the image is not downloaded yet)
                if not game.image_path:
                    # Clean the image URL to remove query parameters
                    parsed_url = urlparse(image_url)
                    cleaned_url = urlunparse(parsed_url._replace(query=''))  # Remove query parameters

                    # Attempt to download the image multiple times
                    max_attempts = 3  # Number of attempts
                    attempt_count = 1
                    while attempt_count <= max_attempts:
                        response = requests.get(cleaned_url)

                        if response.status_code == 200:
                            # Create directory if it doesn't exist
                            image_dir = os.path.join("media", "online_game_images")  # Change this directory path as needed
                            image_name = cleaned_url.split('/')[-1]  # Get the image name from the cleaned URL
                            image_path = os.path.join(image_dir, image_name)  # Complete path for saving the image
                            os.makedirs(image_dir, exist_ok=True)  # Create the directory if it doesn't exist

                            # Save image to file system
                            with open(image_path, 'wb') as f:
                                f.write(response.content)

                            # Update image_path field in the database
                            game.image_path = image_path
                            game.save()

                            print(f"Image for {game.title} saved successfully on attempt {attempt_count}.")
                            break  # Exit the loop if successful
                        else:
                            print(f"Failed to download image for {game.title} on attempt {attempt_count}. Status code: {response.status_code}")
                            attempt_count += 1
                            time.sleep(1)  # Wait for 1 second before retrying

                    if attempt_count > max_attempts:
                        print(f"Failed to download image for {game.title} after {max_attempts} attempts.")
                else:
                    print(f"Image for {game.title} already exists in the database.")
            except Exception as e:
                print(f"Error downloading image for {game.title}: {str(e)}")
        else:
            print(f"No image URL found for {game.title}.")

if __name__ == "__main__":
    download_and_save_images()
