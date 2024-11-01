import scrapy
import json
import os
import urllib.request  # To download images
from datetime import datetime

# Ensure Django is set up before importing models
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cotex.settings')
import django
django.setup()

from gamestorrent.items import OnlineGameItem  # Import the DjangoItem
from myapp.models import GameOnline  # Import your Django model

class GameDetailsOnlineSpider(scrapy.Spider):
    name = "game_details_online"
    allowed_domains = ["game3rb.com"]
    scraped_links = set()

    def start_requests(self):
        script_dir = os.path.dirname(__file__)
        rel_path = '../../visited_links_games_online.json'
        abs_file_path = os.path.join(script_dir, rel_path)

        scraped_rel_path = '../../scraped_games_online.json'
        scraped_abs_file_path = os.path.join(script_dir, scraped_rel_path)

        # Load previously scraped links to avoid duplicates
        if os.path.exists(scraped_abs_file_path):
            try:
                with open(scraped_abs_file_path, 'r') as f:
                    scraped_games = json.load(f)
                    self.scraped_links = {game['link'] for game in scraped_games if 'link' in game}
            except (FileNotFoundError, json.JSONDecodeError) as e:
                self.logger.error(f"Error reading the scraped games JSON file: {scraped_abs_file_path} - {e}")

        # Load game links to be scraped
        if os.path.exists(abs_file_path):
            try:
                with open(abs_file_path, 'r') as f:
                    existing_games = json.load(f)
                    for game in existing_games:
                        link = game.get('link')
                        if link and link.startswith("//"):
                            link = "https:" + link

                        if link not in self.scraped_links:
                            yield scrapy.Request(url=link, callback=self.parse_game, meta={'game': game})

            except (FileNotFoundError, json.JSONDecodeError) as e:
                self.logger.error(f"Error reading the JSON file: {abs_file_path} - {e}")

    def parse_game(self, response):
        """Parse the game details and save to database."""
        game = response.meta['game']
        title = game.get('title', 'unknown_title')  # Fallback for title
        html_code = response.text  # Store the entire HTML content

        # Extract image URL
        image_url = response.css('div.game-page div.game-img img::attr(src)').get()
        if image_url and image_url.startswith("//"):
            image_url = "https:" + image_url

        # Save the image to a specified directory
        image_path = None
        if image_url:
            image_path = self.download_image(image_url, title)

        # Create an OnlineGameItem to save the data
        item = OnlineGameItem()
        item['title'] = title
        item['html_code'] = html_code
        item['image_path'] = image_path

        # Save to the database
        self.save_to_database(item)

        yield item

    def download_image(self, url, title):
        """Download the image from the URL and save it locally."""
        try:
            # Create a directory for images if it doesn't exist
            image_dir = os.path.join('images', 'game_images')  # Change path as necessary
            os.makedirs(image_dir, exist_ok=True)

            # Construct the file path and download the image
            image_filename = f"{title.replace(' ', '_')}.jpg"  # Replace spaces for filename
            image_path = os.path.join(image_dir, image_filename)

            # Download the image
            urllib.request.urlretrieve(url, image_path)
            self.logger.info(f"Downloaded image for {title}: {image_path}")
            return image_path
        except Exception as e:
            self.logger.error(f"Failed to download image {url}: {e}")
            return None

    def save_to_database(self, item):
        """Save the item to the database (Django model)."""
        GameOnline.objects.update_or_create(title=item['title'], defaults={
            'html_code': item['html_code'],
            'image_path': item['image_path'],
        })

    def closed(self, reason):
        """Update the scraped links JSON file when the spider closes."""
        # Optional: Save scraped links to a JSON file if needed
        pass
