from rest_framework import serializers
from custom_auth.models import CustomUser
from myapp.models import Game
from .models import Comment, LikeDislike

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

    class Meta:
        model = Comment
        fields = ['id', 'user', 'text', 'time', 'likes_count', 'dislikes_count', 'parent']
        read_only_fields = ['time', 'likes_count', 'dislikes_count']

    def get_likes_count(self, comment):
        return LikeDislike.objects.filter(comment=comment, like=True).count()

    def get_dislikes_count(self, comment):
        return LikeDislike.objects.filter(comment=comment, like=False).count()
    


from rest_framework import serializers
from .models import Comment

class CommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['user', 'game', 'text', 'parent']

