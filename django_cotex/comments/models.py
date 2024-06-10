from django.db import models
from custom_auth.models import CustomUser
from myapp.models import Game

class Comment(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    text = models.TextField()
    time = models.DateTimeField(auto_now_add=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')

    def __str__(self):
        return f"Comment by {self.user.email} on {self.game.title}"

class LikeDislike(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
    like = models.BooleanField(null=True, blank=True)  # Null for no reaction, True for like, False for dislike

    class Meta:
        unique_together = ('user', 'comment')  # Each user can like/dislike a comment only once

    def __str__(self):
        reaction = "No Reaction" if self.like is None else "Like" if self.like else "Dislike"
        return f"{reaction} by {self.user.email} on {self.comment}"
