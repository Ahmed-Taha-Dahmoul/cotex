from rest_framework import serializers
from custom_auth.models import CustomUser
from myapp.models import Game
from .models import Comment, LikeDislike, CommentReport , Notification


class UserSerializer(serializers.ModelSerializer):
    profile_pic = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['username', 'profile_pic']

    def get_profile_pic(self, user):
        request = self.context.get('request')
        profile_pic_url = user.profile_pic.url
        if request:
            return request.build_absolute_uri(profile_pic_url)
        return profile_pic_url


class CommentDetailSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    likes_count = serializers.SerializerMethodField()
    dislikes_count = serializers.SerializerMethodField()
    liked_disliked_by_user = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'user', 'text', 'time', 'likes_count', 'dislikes_count', 'parent', 'liked_disliked_by_user']
        read_only_fields = ['time', 'likes_count', 'dislikes_count', 'liked_disliked_by_user']

    def get_likes_count(self, comment):
        return LikeDislike.objects.filter(comment=comment, like=True).count()

    def get_dislikes_count(self, comment):
        return LikeDislike.objects.filter(comment=comment, like=False).count()

    def get_liked_disliked_by_user(self, comment):
        user = self.context['request'].user
        if user.is_authenticated:
            try:
                like_dislike = LikeDislike.objects.get(user=user, comment=comment)
                return like_dislike.like  # Return True if like, False if dislike, None if no reaction
            except LikeDislike.DoesNotExist:
                return None  # Return None if no reaction exists
        return None  # Return None if user is not authenticated


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('user', 'game', 'text', 'parent')  # Excluding 'time' as it's auto-generated


class CommentReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentReport
        fields = ['id', 'comment', 'reported_by', 'reason', 'time']
        read_only_fields = ['time', 'reported_by', 'comment']


class NotificationSerializer(serializers.ModelSerializer):
    sender_profile_pic = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = '__all__'

    def get_sender_profile_pic(self, obj):
        return obj.sender.profile_pic.url if obj.sender and obj.sender.profile_pic else None