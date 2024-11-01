import scrapy
import json
import os

class GameOnlineLinksSpider(scrapy.Spider):
    name = "game_online_links"
    allowed_domains = ["game3rb.com"]
    start_urls = ["https://game3rb.com/category/games-online/"]

    links_file = 'visited_links_games_online.json'
    new_games = []
    first_link = None

    def start_requests(self):
        # Load visited games from JSON file if it exists
        if os.path.exists(self.links_file):
            with open(self.links_file, 'r') as f:
                scraped_games = json.load(f)
                if scraped_games:
                    self.first_link = scraped_games[0]['link']
        
        # Start crawling
        for url in self.start_urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        # Select each game post within the main posts section
        games = response.css('div.main-posts article.post-hentry')
        for game in games:
            # Extract title and link
            title = game.css('h3.g1-gamma.g1-gamma-1st.entry-title a::text').get()
            link = game.css('h3.g1-gamma.g1-gamma-1st.entry-title a::attr(href)').get()

            # Stop if link matches the first link saved in JSON file
            if link == self.first_link:
                self.log(f"Stopping crawl as link {link} matches the first saved link.")
                return

            # Add game to the list if it's valid
            if link and link.startswith("https://game3rb.com"):
                self.new_games.append({
                    'title': title,
                    'link': link
                })

                yield {
                    'title': title,
                    'link': link
                }

        # Follow pagination if a next page exists
        next_page = response.css('div.wp-pagenavi a.nextpostslink::attr(href)').get()
        if next_page:
            yield scrapy.Request(url=next_page, callback=self.parse)

    def closed(self, reason):
        # Load existing games if they exist
        existing_games = []
        if os.path.exists(self.links_file):
            with open(self.links_file, 'r') as f:
                existing_games = json.load(f)

        # Combine new games with existing games, adding new ones at the top
        combined_games = self.new_games + existing_games

        # Save combined games to JSON file when the spider closes
        with open(self.links_file, 'w') as f:
            json.dump(combined_games, f, indent=4)
