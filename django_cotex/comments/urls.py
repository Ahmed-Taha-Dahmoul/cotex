# urls.py
from django.urls import path
from .views import (
    CommentListAPIView,
    
)

urlpatterns = [
    path('', CommentListAPIView.as_view(), name='comment-detail'),
]
