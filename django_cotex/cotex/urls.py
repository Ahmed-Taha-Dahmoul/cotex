from django.contrib import admin
from django.urls import path, include
from django.conf import settings  # Import settings module
from django.conf.urls.static import static  # Import static function

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('myapp.urls')),
    path('auth/', include('custom_auth.urls')),
]

# Add urlpatterns for serving media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
