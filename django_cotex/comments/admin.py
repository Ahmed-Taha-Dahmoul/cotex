from django.contrib import admin
from .models import Comment, LikeDislike, CommentReport
from .forms import CommentForm

class LikeDislikeInline(admin.TabularInline):
    model = LikeDislike

class CommentReportInline(admin.TabularInline):
    model = CommentReport
    extra = 0  # Display existing reports without the option to add new ones

class CommentAdmin(admin.ModelAdmin):
    form = CommentForm
    list_display = ('user', 'game', 'time', 'parent_info', 'get_likes', 'get_dislikes', 'get_reports_count')  # Include custom method to display parent info and reports count
    list_filter = ('game',)  # Add filter by game
    search_fields = ('user__email', 'game__title', 'text')  # Add search fields
    inlines = [LikeDislikeInline, CommentReportInline]  # Inline likes, dislikes, and reports

    def get_likes(self, obj):
        return obj.likedislike_set.filter(like=True).count()

    def get_dislikes(self, obj):
        return obj.likedislike_set.filter(like=False).count()

    def get_reports_count(self, obj):
        return obj.reports.count()  # Assuming 'reports' is the related_name in CommentReport model

    get_likes.short_description = 'Likes'
    get_dislikes.short_description = 'Dislikes'
    get_reports_count.short_description = 'Reports'

admin.site.register(Comment, CommentAdmin)
admin.site.register(CommentReport)  # Register CommentReport with admin
