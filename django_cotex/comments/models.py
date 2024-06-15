from django.utils import timezone
from django.db import models
from custom_auth.models import CustomUser
from myapp.models import Game

class Comment(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    text = models.TextField()
    time = models.DateTimeField()
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')

    def __str__(self):
        return f"Comment by {self.user.email} on {self.game.title}"

    def save(self, *args, **kwargs):
        if not self.id:  # If it's a new comment
            self.time = timezone.now()  # Set the current time
        return super().save(*args, **kwargs)

    def parent_info(self):
        if self.parent:
            return f"Reply to: {self.parent.user.email} - {self.parent.text[:30]}..."
        return "No Parent"
    parent_info.short_description = 'Parent Comment'

class LikeDislike(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
    like = models.BooleanField(null=True, blank=True)  # Null for no reaction, True for like, False for dislike

    class Meta:
        unique_together = ('user', 'comment')  # Each user can like/dislike a comment only once

    def __str__(self):
        reaction = "No Reaction" if self.like is None else "Like" if self.like else "Dislike"
        return f"{reaction} by {self.user.email} on {self.comment}"
