from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterAPIView, LoginAPIView, UserInfoView

urlpatterns = [
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('user/', UserInfoView.as_view(), name='user-info'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
