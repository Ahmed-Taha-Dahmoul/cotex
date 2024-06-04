from django.urls import path
from .views import GameAPIView , GameDetailsAPIView , GameSearchAPIView

urlpatterns = [
    path('games/', GameAPIView.as_view(), name='game-list'),
    path('games/<int:id>/', GameDetailsAPIView.as_view(), name='game-details'),
    path('search/', GameSearchAPIView.as_view(), name='search_games'),
]
