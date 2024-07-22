from django.urls import path
from .views import (
    CommentListAPIView,
    CommentCreateAPIView,
    LikeCommentAPIView, 
    DislikeCommentAPIView,
    CommentReportCreateView,
    NotificationListView, 
    NotificationUpdateView,
)

urlpatterns = [
    path('', CommentListAPIView.as_view(), name='comment-detail'),
    path('create/', CommentCreateAPIView.as_view(), name='comment-create'),
    path('<int:comment_id>/like/', LikeCommentAPIView.as_view(), name='comment-like'),
    path('<int:comment_id>/dislike/', DislikeCommentAPIView.as_view(), name='comment-dislike'),
    path('<int:comment_id>/report/', CommentReportCreateView.as_view(), name='comment-report-create'),

    path('notifications/', NotificationListView.as_view(), name='notification-list'),
    path('notifications/<int:pk>/', NotificationUpdateView.as_view(), name='notification-update'),

]
