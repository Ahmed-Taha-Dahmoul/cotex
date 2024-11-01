import scrapy
import json
import os
from urllib.parse import urlparse
from gamestorrent.items import OnlineGameItem

class GameOnlineSpider(scrapy.Spider):
    name = "game_online_details"
    allowed_domains = ["game3rb.com"]
    start_urls = []
    download_delay = 0.2  # Delay in seconds between requests

    def __init__(self, *args, **kwargs):
        super(GameOnlineSpider, self).__init__(*args, **kwargs)
        self.first_scraped_game = None  # Variable to track the first scraped game
        self.scraped_file_path = os.path.join(os.path.dirname(__file__), '../../scraped_games_online_everyday.json')

        # Load the first scraped game link if the file exists
        if os.path.exists(self.scraped_file_path):
            with open(self.scraped_file_path, 'r') as f:
                try:
                    scraped_games = json.load(f)
                    if scraped_games:  # Check if there are any scraped games
                        self.first_scraped_game = scraped_games[0]  # Load the first scraped game
                        self.logger.info(f"First scraped game loaded: {self.first_scraped_game}")
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
                        first_visited_link = visited_links[0].get('link')

                        # If there are scraped games, check the first one
                        if self.first_scraped_game and self.first_scraped_game['link'] == first_visited_link:
                            self.logger.info("Stopping spider as the first visited link matches the first scraped game link.")
                            return  # Stop the spider if the links match

                        # Start scraping each link one by one
                        for game in visited_links:
                            link = game.get('link')
                            if link:
                                # Introducing a delay before each request
                                yield scrapy.Request(url=link, callback=self.parse_game, meta={'title': game.get('title'), 'link': link},
                                                     dont_filter=True, priority=1)
            except json.JSONDecodeError:
                self.logger.error(f"Error reading JSON file: {abs_file_path}")

    def parse_game(self, response):
        title = response.meta['title']
        link = response.meta['link']
        html_content = response.body.decode('utf-8')  # Get the full HTML content

        # Extract title_uri from the link
        parsed_url = urlparse(link)
        title_uri = parsed_url.path.split('/')[-1] if parsed_url.path.split('/')[-1] else parsed_url.path.split('/')[-2]

        # Extract the image URL from the HTML
        image_url = response.css('div#post-content div.post-body img::attr(src)').get()

        # If an image URL is found, set the image path
        image_path = None
        if image_url:
            image_name = f"{title_uri}.jpg"  # Create a name for the image
            image_path = f"media/game_images/{image_name}"  # Relative path to save the image
            yield scrapy.Request(url=image_url, callback=self.download_image, meta={'image_path': image_path, 'title_uri': title_uri})

        # Create an item instance to yield to the pipeline
        item = OnlineGameItem()
        item['title'] = title
        item['title_uri'] = title_uri
        item['html_code'] = html_content
        item['image_path'] = image_path  # This will be updated in the download_image callback

        self.logger.info(f'Scraped HTML for game: {title}, title_uri: {title_uri}, image_path: {image_path}')

        # Save the first scraped game
        if self.first_scraped_game is None:
            self.first_scraped_game = {
                'title': title,
                'link': link,
                'title_uri': title_uri
            }

        yield item  # Yield item for the pipeline to save

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
        # After the spider closes, save the first scraped game to the JSON file
        if self.first_scraped_game:
            with open(self.scraped_file_path, 'w') as f:
                json.dump([self.first_scraped_game], f, indent=4)  # Only save the first game

        self.logger.info(f'Spider closed: {reason}')
