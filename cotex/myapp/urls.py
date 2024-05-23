from django.urls import path
from .views import GameAPIView

urlpatterns = [
    path('games/', GameAPIView.as_view(), name='game-list'),
]
