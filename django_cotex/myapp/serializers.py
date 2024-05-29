from rest_framework import serializers
from .models import Game

class Game_title_cracker_version_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ('id','title', 'cracker', 'version','image_url')



class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = '__all__'

