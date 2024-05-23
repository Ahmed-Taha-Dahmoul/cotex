import scrapy
import json
import os
from googletrans import Translator

# Ensure Django is setup before importing models
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cotex.settings')
import django
django.setup()

from gamestorrent.items import GameItem  # Import the DjangoItem

class GameDetailsSpider(scrapy.Spider):
    name = "game_details_everyday"
    allowed_domains = ["gamestorrents.fm"]
    translator = Translator()
    scraped_game = None
    scraped_links = set()

    def start_requests(self):
        script_dir = os.path.dirname(__file__)
        rel_path = '../../visited_links_everyday.json'
        abs_file_path = os.path.join(script_dir, rel_path)

        scraped_rel_path = '../../scraped_games_evreyday.json'
        scraped_abs_file_path = os.path.join(script_dir, scraped_rel_path)

        existing_games = []

        # Load scraped games
        if os.path.exists(scraped_abs_file_path):
            try:
                with open(scraped_abs_file_path, 'r') as f:
                    scraped_games = json.load(f)
                    self.scraped_links = {game['link'] for game in scraped_games if 'link' in game}
            except (FileNotFoundError, json.decoder.JSONDecodeError):
                self.logger.error(f"Error reading the scraped games JSON file: {scraped_abs_file_path}")

        # Load existing games
        if os.path.exists(abs_file_path):
            try:
                with open(abs_file_path, 'r') as f:
                    existing_games = json.load(f)
            except (FileNotFoundError, json.decoder.JSONDecodeError):
                self.logger.error(f"Error reading the JSON file: {abs_file_path}")

        if existing_games:
            self.scraped_game = existing_games[0]  # Store the first game for later use
            for game in existing_games:
                link = game.get('link')
                if link and link.startswith("//"):
                    link = "https:" + link

                if link in self.scraped_links:
                    self.logger.info(f"Stopping scraping because the game is already scraped: {link}")
                    return  # Stop scraping if the game is already in scraped links
                
                yield scrapy.Request(url=link, callback=self.parse_game, meta={'game': game})

    def parse_game(self, response):
        if not response.body:
            return

        game = response.meta['game']

        item = GameItem()
        item['title'] = response.css('div.col-md-6 ul.listencio li:contains("Nombre:") strong::text').get()
        item['platform'] = response.css('li.plataforma strong::text').get()
        
        # Extract genres correctly
        genres = response.css('li:contains("Genero:") span.cationen a::text').getall()
        item['genres'] = [self.translate_to_english(genre) for genre in genres]

        item['languages'] = response.css('li.idioma span img::attr(title)').getall()
        item['format'] = response.css('li:contains("Formato:") strong::text').get()
        item['description'] = response.css('p.mantekol').xpath('string()').get()
        item['release_date'] = response.css('li:contains("Fecha:") strong::text').get()
        item['cracker'] = response.css('li:contains("Release:") strong::text').get()
        item['version'] = response.css('li:contains("Version:") strong::text').get()
        item['size'] = response.css('li:contains("Tamaño:") strong::text').get()
        
        youtube_link = response.css('div.videoWrapperOuter div.videoWrapperInner iframe::attr(src)').get()
        if youtube_link:
            video_id = youtube_link.split('/')[-1]
            item['youtube_link'] = f'https://www.youtube.com/watch?v={video_id}'

        download_link = response.css('a#download_torrent::attr(href)').get()
        if download_link:
            item['download_link'] = 'https://www.gamestorrents.fm/' + download_link

        item['image_url'] = response.css('div.game-page div.game-img img::attr(src)').get()

        item['description'] = self.translate_to_english(item['description'])

        yield item

    def closed(self, reason):
        # Called when the spider finishes scraping
        if self.scraped_game:
            title = self.scraped_game['title']
            link = self.scraped_game.get('link')
            if link and link.startswith("//"):
                link = "https:" + link
            self.update_scraped_links(title, link)

    def update_scraped_links(self, title, link):
        script_dir = os.path.dirname(__file__)
        rel_path = '../../scraped_games_everyday.json'
        abs_file_path = os.path.join(script_dir, rel_path)

        first_game = {"title": title, "link": link}

        with open(abs_file_path, 'w') as f:
            json.dump([first_game], f, indent=4)  # Overwrite with only the first game

    def translate_to_english(self, text):
        if not text:
            return ''
        translated_text = self.translator.translate(text, src='auto', dest='en')
        return translated_text.text
