from scrapy_djangoitem import DjangoItem
from myapp.models import Game , GameOnline

class GameItem(DjangoItem):
    django_model = Game

class OnlineGameItem(DjangoItem):
    django_model = GameOnline
