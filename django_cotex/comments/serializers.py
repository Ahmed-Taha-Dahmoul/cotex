# comments/serializers.py
from rest_framework import serializers
from .models import Comment


from rest_framework import serializers
from custom_auth.models import CustomUser
from myapp.models import Game




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
    user = UserSerializer(read_only=True)  # Remove the source argument

    class Meta:
        model = Comment
        fields = ['id', 'user', 'text', 'time', 'likes', 'dislikes', 'parent']
        read_only_fields = ['time', 'likes', 'dislikes']




class CommentLikeDislikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['likes', 'dislikes']

class CommentReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'user', 'text', 'time', 'likes', 'dislikes', 'parent']
        read_only_fields = ['time', 'likes', 'dislikes']
