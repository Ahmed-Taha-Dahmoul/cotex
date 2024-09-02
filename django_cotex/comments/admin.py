from django.contrib import admin
from .models import Comment, LikeDislike, CommentReport, Notification
from .forms import CommentForm

class LikeDislikeInline(admin.TabularInline):
    model = LikeDislike

class CommentReportInline(admin.TabularInline):
    model = CommentReport
    extra = 0  # Display existing reports without the option to add new ones

class CommentAdmin(admin.ModelAdmin):
    form = CommentForm
    list_display = ('user', 'get_game', 'time', 'parent_info', 'get_likes', 'get_dislikes', 'get_reports_count')  # Updated game reference
    list_filter = ('time',)  # Removed game from filter
    search_fields = ('user__email', 'text')  # Removed game from search fields
    inlines = [LikeDislikeInline, CommentReportInline]  # Inline likes, dislikes, and reports

    def get_game(self, obj):
        return obj.game.title if obj.game else "No Game"  # Assuming obj.game points to the correct related object

    get_game.short_description = 'Game'

    def get_likes(self, obj):
        return obj.likedislike_set.filter(like=True).count()

    def get_dislikes(self, obj):
        return obj.likedislike_set.filter(like=False).count()

    def get_reports_count(self, obj):
        return obj.reports.count()  # Assuming 'reports' is the related_name in CommentReport model

    get_likes.short_description = 'Likes'
    get_dislikes.short_description = 'Dislikes'
    get_reports_count.short_description = 'Reports'

class NotificationAdmin(admin.ModelAdmin):
    list_display = ('recipient', 'sender', 'comment', 'notification_type', 'message', 'created_at', 'is_read')
    list_filter = ('notification_type', 'is_read', 'created_at')
    search_fields = ('recipient__email', 'sender__email', 'message')
    readonly_fields = ('created_at',)

admin.site.register(Comment, CommentAdmin)
admin.site.register(CommentReport)  # Register CommentReport with admin
admin.site.register(Notification, NotificationAdmin)  # Register Notification with admin
