# urls.py
from django.urls import path
from .views import (
    CommentListAPIView,
    CommentCreateAPIView,
    LikeCommentAPIView, 
    DislikeCommentAPIView,
)

urlpatterns = [
    path('', CommentListAPIView.as_view(), name='comment-detail'),
    path('create/', CommentCreateAPIView.as_view(), name='comment-create'),
    path('<int:comment_id>/like/', LikeCommentAPIView.as_view(), name='comment-like'),
    path('<int:comment_id>/dislike/', DislikeCommentAPIView.as_view(), name='comment-dislike'),
]
