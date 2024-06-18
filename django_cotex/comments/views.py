from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import CommentDetailSerializer, CommentSerializer
from .models import Comment, LikeDislike




class CommentListAPIView(generics.ListAPIView):
    serializer_class = CommentDetailSerializer
    def get_queryset(self):
        game_id = self.request.query_params.get('game')
        if game_id:
            queryset = Comment.objects.filter(game_id=game_id).select_related('user').order_by('time')
            return queryset
        return Comment.objects.none()




class CommentCreateAPIView(generics.CreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)  # Automatically set the user based on the request




class LikeCommentAPIView(generics.UpdateAPIView):
    serializer_class = CommentDetailSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def update(self, request, *args, **kwargs):
        user = request.user
        comment_id = self.kwargs.get('comment_id')

        try:
            comment = Comment.objects.get(pk=comment_id)
        except Comment.DoesNotExist:
            return Response({"error": "Comment does not exist"}, status=status.HTTP_404_NOT_FOUND)

        like, created = LikeDislike.objects.get_or_create(user=user, comment=comment)

        # If already liked, remove the like
        if like.like:
            like.delete()
        else:
            like.like = True
            like.save()

        serializer = self.get_serializer(comment)
        return Response(serializer.data, status=status.HTTP_200_OK)


class DislikeCommentAPIView(generics.UpdateAPIView):
    serializer_class = CommentDetailSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def update(self, request, *args, **kwargs):
        user = request.user
        comment_id = self.kwargs.get('comment_id')

        try:
            comment = Comment.objects.get(pk=comment_id)
        except Comment.DoesNotExist:
            return Response({"error": "Comment does not exist"}, status=status.HTTP_404_NOT_FOUND)

        # Check if the user has already disliked the comment
        dislike, created = LikeDislike.objects.get_or_create(user=user, comment=comment)

        if created or dislike.like:
            # If the dislike is new or the user previously liked the comment
            dislike.like = False
            dislike.save()
        else:
            # If the user already disliked the comment, remove the dislike
            dislike.delete()

        # Update the comment object with the new dislikes count
        comment.refresh_from_db()

        serializer = self.get_serializer(comment)
        return Response(serializer.data, status=status.HTTP_200_OK)
