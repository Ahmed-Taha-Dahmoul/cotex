from import_export import resources
from import_export.admin import ImportExportMixin
from django.contrib import admin
from .models import Game

class GameResource(resources.ModelResource):
    class Meta:
        model = Game
        fields = ('id', 'title', 'description', 'release_date', 'cracker', 'platform', 'version', 'genres', 'languages', 'format', 'size', 'youtube_link', 'download_link', 'image_url')

@admin.register(Game)
class GameAdmin(ImportExportMixin, admin.ModelAdmin):
    resource_class = GameResource
    list_display = ('title', 'release_date', 'platform', 'version')
    search_fields = ['title', 'platform', 'version']
    show_full_result_count = False  # Disable pagination
