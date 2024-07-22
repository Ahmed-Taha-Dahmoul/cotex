from django.db import models
from django.utils import timezone
from django.db.models.signals import post_save
from django.dispatch import receiver
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
        super().save(*args, **kwargs)  # Call the original save method

    def parent_info(self):
        if self.parent:
            return f"Reply to: {self.parent.user.email} - {self.parent.text[:30]}..."
        return "No Parent"
    parent_info.short_description = 'Parent Comment'

@receiver(post_save, sender=Comment)
def create_notifications(sender, instance, created, **kwargs):
    if created and instance.parent:
        Notification.objects.create(
            recipient=instance.parent.user,
            sender=instance.user,
            comment=instance,
            notification_type='reply',
            message=f'{instance.user.username} replied to your comment.'
        )

class LikeDislike(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
    like = models.BooleanField(null=True, blank=True)  # Null for no reaction, True for like, False for dislike

    class Meta:
        unique_together = ('user', 'comment')  # Each user can like/dislike a comment only once

    def __str__(self):
        reaction = "No Reaction" if self.like is None else "Like" if self.like else "Dislike"
        return f"{reaction} by {self.user.email} on {self.comment}"

@receiver(post_save, sender=LikeDislike)
def create_like_dislike_notifications(sender, instance, created, **kwargs):
    if created:
        # New LikeDislike - Create notification (this part is likely fine)
        notification_type = 'like' if instance.like else 'dislike'
        message = f'{instance.user.username} {"liked" if instance.like else "disliked"} your comment.'
        Notification.objects.create(
            recipient=instance.comment.user,
            sender=instance.user,
            comment=instance.comment,
            notification_type=notification_type,
            message=message
        )
        print(f"Notification created: {notification_type} - {message}")

    else:
        # LikeDislike updated - Check for existing notification and UPDATE
        try:
            notification = Notification.objects.get(
                sender=instance.user,
                comment=instance.comment,
            )

            # Update the existing notification
            notification.notification_type = 'like' if instance.like else 'dislike'
            notification.message = f'{instance.user.username} {"liked" if instance.like else "disliked"} your comment.'
            notification.save()

            print(f"Notification updated to: {'like' if instance.like else 'dislike'}")

        except Notification.DoesNotExist:
            # No existing notification, create a new one (should be rare)
            notification_type = 'like' if instance.like else 'dislike'
            message = f'{instance.user.username} {"liked" if instance.like else "disliked"} your comment.'
            Notification.objects.create(
                recipient=instance.comment.user,
                sender=instance.user,
                comment=instance.comment,
                notification_type=notification_type,
                message=message
            )
            print(f"New notification created: {notification_type}")



class CommentReport(models.Model):
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='reports')
    reported_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='comment_reports')
    reason = models.TextField()
    time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Report by {self.reported_by.email} on {self.comment}"

class Notification(models.Model):
    recipient = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='notifications')
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='sent_notifications', null=True, blank=True)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, null=True, blank=True)
    notification_type = models.CharField(max_length=20)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"Notification for {self.recipient.email} - {self.notification_type}"
