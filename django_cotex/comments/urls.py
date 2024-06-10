# urls.py
from django.urls import path
from .views import (
    CommentListAPIView,
    CommentCreateAPIView
    
)

urlpatterns = [
    path('', CommentListAPIView.as_view(), name='comment-detail'),
    path('create/', CommentCreateAPIView.as_view(), name='comment-create'),
]
