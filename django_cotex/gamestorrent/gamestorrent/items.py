from scrapy_djangoitem import DjangoItem
from myapp.models import Game

class GameItem(DjangoItem):
    django_model = Game
