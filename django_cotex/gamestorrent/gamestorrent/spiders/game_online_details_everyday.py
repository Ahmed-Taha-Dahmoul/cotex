import scrapy
import json
import os
from urllib.parse import urlparse
from gamestorrent.items import OnlineGameItem

class GameOnlineSpider(scrapy.Spider):
    name = "game_online_details"
    allowed_domains = ["game3rb.com"]
    start_urls = []
    download_delay = 0.3  # Delay in seconds between requests
    scraped_links = set()  # Set to store links of scraped games

    def __init__(self, *args, **kwargs):
        super(GameOnlineSpider, self).__init__(*args, **kwargs)
        self.first_scraped_game = None  # Variable to track the first scraped game
        self.scraped_file_path = os.path.join(os.path.dirname(__file__), '../../scraped_games_online_everyday.json')

        # Load the already scraped game links if the file exists
        if os.path.exists(self.scraped_file_path):
            with open(self.scraped_file_path, 'r') as f:
                try:
                    scraped_games = json.load(f)
                    if scraped_games:  # Check if there are any scraped games
                        self.scraped_links = {game['link'] for game in scraped_games if 'link' in game}  # Populate the set
                        self.logger.info(f"Loaded {len(self.scraped_links)} scraped game links.")
                except json.JSONDecodeError:
                    self.logger.error(f"Error reading JSON file: {self.scraped_file_path}")

    def start_requests(self):
        script_dir = os.path.dirname(__file__)
        rel_path = '../../visited_links_games_online.json'
        abs_file_path = os.path.join(script_dir, rel_path)

        # Load the visited links from the JSON file
        if os.path.exists(abs_file_path):
            try:
                with open(abs_file_path, 'r') as f:
                    visited_links = json.load(f)

                    # Check if there are visited links
                    if visited_links:
                        for game in visited_links:
                            link = game.get('link')
                            if link:
                                # Check if the current link is already scraped
                                if link in self.scraped_links:
                                    self.logger.info(f"Stopping spider as the game link is already scraped: {link}")
                                    return  # Stop scraping if the game link matches an already scraped link

                                # Set the first game for saving later
                                if self.first_scraped_game is None:  # Check if it's the first game being scraped
                                    self.first_scraped_game = {
                                        'title': game.get('title'),
                                        'link': link,
                                        'title_uri': urlparse(link).path.split('/')[-1]
                                    }

                                yield scrapy.Request(url=link, callback=self.parse_game, meta={'title': game.get('title'), 'link': link},
                                                     dont_filter=True, priority=1)
            except json.JSONDecodeError:
                self.logger.error(f"Error reading JSON file: {abs_file_path}")

    def parse_game(self, response):
        title = response.meta['title']
        link = response.meta['link']
        html_content = response.body.decode('utf-8')

        parsed_url = urlparse(link)
        title_uri = parsed_url.path.split('/')[-1] if parsed_url.path.split('/')[-1] else parsed_url.path.split('/')[-2]

        image_url = response.css('div#post-content div.post-body img::attr(src)').get()
        image_path = None
        if image_url:
            image_name = f"{title_uri}.jpg"
            image_path = f"media/game_images/{image_name}"
            yield scrapy.Request(url=image_url, callback=self.download_image, meta={'image_path': image_path, 'title_uri': title_uri})

        item = OnlineGameItem()
        item['title'] = title
        item['title_uri'] = title_uri
        item['html_code'] = html_content
        item['image_path'] = image_path

        yield item

    def download_image(self, response):
        image_path = response.meta['image_path']
        title_uri = response.meta['title_uri']

        # Ensure the media directory exists
        media_dir = os.path.join('media', 'game_images')
        if not os.path.exists(media_dir):
            os.makedirs(media_dir)

        # Save the image
        with open(os.path.join(media_dir, f"{title_uri}.jpg"), 'wb') as f:
            f.write(response.body)

        self.logger.info(f'Saved image for {title_uri} at {image_path}')

    def closed(self, reason):
        # After the spider closes, save only the first scraped game to the JSON file
        if self.first_scraped_game:
            try:
                with open(self.scraped_file_path, 'w') as f:
                    # Write only the first scraped game as the only entry in the file
                    json.dump([self.first_scraped_game], f, indent=4)
                self.logger.info(f'Updated the scraped games file with the first game: {self.first_scraped_game["title"]}')
            except IOError as e:
                self.logger.error(f"Failed to write to {self.scraped_file_path}: {e}")

        self.logger.info(f'Spider closed: {reason}')
