import scrapy
import json
import os

class GameLinksSpider(scrapy.Spider):
    name = "game_links"
    allowed_domains = ["gamestorrents.fm"]
    start_urls = ["https://www.gamestorrents.fm/juegos-pc/page/358/"]

    new_games = []
    links_file = 'visited_links.json'
    first_link = None

    def start_requests(self):
        # Load visited games from JSON file if it exists
        if os.path.exists(self.links_file):
            with open(self.links_file, 'r') as f:
                scraped_games = json.load(f)
                if scraped_games:
                    self.first_link = scraped_games[0]['link']
        
        # Start the crawling process
        for url in self.start_urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        # Extract game links and titles
        games = response.css('div.col-md-2.w3l-movie-gride-agile')
        for game in games:
            link = game.css('a::attr(href)').get()
            title = game.css('a::attr(title)').get()

            # Check if this link is the same as the first link in the JSON file
            if link == self.first_link:
                self.log(f"Stopping crawl as link {link} matches the first saved link.")
                return
            
            # Add the game to the list of new games
            self.new_games.append({
                'title': title,
                'link': link
            })

            yield {
                'title': title,
                'link': link
            }

        # Follow the next page link
        next_page = response.css('ul.pagination li a:contains("‹")::attr(href)').get()
        if next_page:
            yield scrapy.Request(url=next_page, callback=self.parse)

    def closed(self, reason):
        # Load existing games if they exist
        existing_games = []
        if os.path.exists(self.links_file):
            with open(self.links_file, 'r') as f:
                existing_games = json.load(f)
        
        # Combine new games with existing games, new ones at the top
        combined_games = self.new_games + existing_games

        # Save combined games to JSON file when the spider closes
        with open(self.links_file, 'w') as f:
            json.dump(combined_games, f, indent=4)
