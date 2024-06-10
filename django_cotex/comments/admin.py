from django.contrib import admin
from .models import Comment, LikeDislike

class LikeDislikeInline(admin.TabularInline):
    model = LikeDislike

class CommentAdmin(admin.ModelAdmin):
    list_display = ('user', 'game', 'time', 'get_likes', 'get_dislikes')  # Include custom methods to display likes and dislikes
    list_filter = ('game',)  # Add filter by game
    search_fields = ('user__email', 'game__title', 'text')  # Add search fields
    inlines = [LikeDislikeInline]  # Inline likes and dislikes

    def get_likes(self, obj):
        return obj.likedislike_set.filter(like=True).count()

    def get_dislikes(self, obj):
        return obj.likedislike_set.filter(like=False).count()

    get_likes.short_description = 'Likes'
    get_dislikes.short_description = 'Dislikes'

admin.site.register(Comment, CommentAdmin)
