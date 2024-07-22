from rest_framework import generics, status , permissions
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import CommentDetailSerializer, CommentSerializer, CommentReportSerializer , NotificationSerializer
from .models import Comment, LikeDislike, CommentReport , Notification
from rest_framework.decorators import api_view
from rest_framework import serializers



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
        serializer.save(user=self.request.user)




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

        dislike, created = LikeDislike.objects.get_or_create(user=user, comment=comment)

        if created or dislike.like:
            dislike.like = False
            dislike.save()
        else:
            dislike.delete()

        comment.refresh_from_db()

        serializer = self.get_serializer(comment)
        return Response(serializer.data, status=status.HTTP_200_OK)
    






class CommentReportCreateView(generics.CreateAPIView):
    queryset = CommentReport.objects.all()
    serializer_class = CommentReportSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def perform_create(self, serializer):
        comment_id = self.kwargs.get('comment_id')
        print("Request data:", self.request.data)  # Debug statement
        try:
            comment = Comment.objects.get(pk=comment_id)
        except Comment.DoesNotExist:
            raise serializers.ValidationError('Comment does not exist')

        serializer.save(comment=comment, reported_by=self.request.user)



class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)

class NotificationUpdateView(generics.UpdateAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'pk'