from django.db import models

class Game(models.Model):
    title = models.CharField(max_length=200, null=True)
    description = models.TextField(null=True)
    release_date = models.CharField(max_length=100, null=True)
    cracker = models.CharField(max_length=100, null=True)
    platform = models.CharField(max_length=100, null=True)
    version = models.CharField(max_length=100, null=True)
    genres = models.JSONField( null=True)
    languages = models.JSONField( null=True)
    format = models.CharField(max_length=100, null=True)
    size = models.CharField(max_length=100, null=True)
    youtube_link = models.URLField(max_length=500, null=True)
    download_link = models.URLField(max_length=500, null=True)
    image_url = models.URLField(max_length=500, null=True)

    def __str__(self):
        return self.title if self.title else "Unnamed Game"
