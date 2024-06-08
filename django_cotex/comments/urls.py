# urls.py
from django.urls import path
from .views import (
    CommentDetailAPIView,
    CommentLikeDislikeAPIView,
    CommentReplyCreateAPIView,
)

urlpatterns = [
    path('', CommentDetailAPIView.as_view(), name='comment-detail'),
    path('<int:game_id>/like_dislike/', CommentLikeDislikeAPIView.as_view(), name='comment-like-dislike'),
    path('<int:game_id>/reply/', CommentReplyCreateAPIView.as_view(), name='comment-reply-create'),
]
