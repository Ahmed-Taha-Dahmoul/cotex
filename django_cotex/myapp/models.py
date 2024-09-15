from django.db import models

class GameBase(models.Model):
    title = models.CharField(max_length=200, null=True)

    class Meta:
        abstract = True  # This makes it an abstract model

    def __str__(self):
        return self.title if self.title else "Unnamed Game"


class Game(GameBase):
    description = models.TextField(null=True)
    release_date = models.DateField(null=True)
    cracker = models.CharField(max_length=100, null=True)
    platform = models.CharField(max_length=100, null=True)
    version = models.CharField(max_length=100, null=True)
    genres = models.JSONField(null=True)
    languages = models.JSONField(null=True)
    format = models.CharField(max_length=100, null=True)
    size = models.CharField(max_length=100, null=True)
    youtube_link = models.URLField(max_length=500, null=True)
    download_link = models.URLField(max_length=500, null=True)
    image_url = models.URLField(max_length=500, null=True)
    image_path = models.CharField(max_length=500, null=True)  # New field to store image path

    def __str__(self):
        return self.title if self.title else "Unnamed Game"


class GameOnline(GameBase):
    description = models.TextField(null=True)
    release_date = models.DateField(null=True)
    cracker = models.CharField(max_length=100, null=True)
    genres = models.JSONField(null=True)
    reviews = models.TextField(null=True)
    size = models.CharField(max_length=100, null=True)
    image_paths = models.JSONField(null=True)  
    video_link = models.URLField(max_length=500, null=True)
    screen_shots_paths = models.JSONField(null=True)
    download_link = models.URLField(max_length=500, null=True)
    

    def __str__(self):
        return self.title if self.title else "Unnamed Game"
