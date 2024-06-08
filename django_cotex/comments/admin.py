from django.contrib import admin
from .models import Comment

class CommentAdmin(admin.ModelAdmin):
    list_display = ('user', 'game', 'time', 'likes', 'dislikes')  # Fields to display in the admin list
    list_filter = ('game',)  # Add filter by game
    search_fields = ('user__email', 'game__title', 'text')  # Add search fields

admin.site.register(Comment, CommentAdmin)
