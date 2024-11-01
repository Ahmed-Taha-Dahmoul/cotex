from django.contrib import admin
from import_export import resources
from import_export.admin import ImportExportMixin
from .models import Game, GameOnline

# Resource class for Game
class GameResource(resources.ModelResource):
    class Meta:
        model = Game
        fields = ('id', 'title', 'description', 'release_date', 'cracker', 'platform', 'version', 'genres', 'languages', 'format', 'size', 'youtube_link', 'download_link', 'image_url')

# Admin class for Game
@admin.register(Game)
class GameAdmin(ImportExportMixin, admin.ModelAdmin):
    resource_class = GameResource
    list_display = ('title', 'release_date', 'platform', 'version')
    search_fields = ['title', 'platform', 'version', 'release_date']
    show_full_result_count = False  # Disable pagination


# Resource class for GameOnline
class GameOnlineResource(resources.ModelResource):
    class Meta:
        model = GameOnline
        fields = ('id', 'title', 'image_path', 'html_code')

# Admin class for GameOnline
@admin.register(GameOnline)
class GameOnlineAdmin(ImportExportMixin, admin.ModelAdmin):
    resource_class = GameOnlineResource
    list_display = ('title', 'image_path')  # You can add more fields if needed
    search_fields = ['title']  # You can expand search fields as necessary
    show_full_result_count = False  # Disable pagination
