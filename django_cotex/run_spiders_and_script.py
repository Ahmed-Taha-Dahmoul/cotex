import subprocess
import sys
import os

def run_spider(spider_name):
    command = [sys.executable, '-m', 'scrapy', 'crawl', spider_name]
    result = subprocess.run(command, cwd='gamestorrent')
    if result.returncode != 0:
        print(f"Error running {spider_name}")

def run_additional_script(script_path):
    command = [sys.executable, script_path]
    result = subprocess.run(command)
    if result.returncode != 0:
        print(f"Error running {script_path}")

if __name__ == "__main__":
    # Running spiders
    run_spider('game_links_everyday')
    run_spider('game_details_everyday')

    # Running additional script
    run_additional_script('download_images_path.py')
