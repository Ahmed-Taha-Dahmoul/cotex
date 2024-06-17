from django.contrib import admin
from .models import Comment, LikeDislike
from .forms import CommentForm

class LikeDislikeInline(admin.TabularInline):
    model = LikeDislike

class CommentAdmin(admin.ModelAdmin):
    form = CommentForm
    list_display = ('user', 'game', 'time', 'parent_info', 'get_likes', 'get_dislikes')  # Include custom method to display parent info
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
