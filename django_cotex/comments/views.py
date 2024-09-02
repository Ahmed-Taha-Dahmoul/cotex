from rest_framework import generics, status , permissions
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import CommentDetailSerializer, CommentSerializer, CommentReportSerializer , NotificationSerializer
from .models import Comment, LikeDislike, CommentReport , Notification
from rest_framework.decorators import api_view
from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType


class CommentListAPIView(generics.ListAPIView):
    serializer_class = CommentDetailSerializer
    
    def get_queryset(self):
        content_type_id = self.request.query_params.get('content_type')
        object_id = self.request.query_params.get('object_id')
        
        if content_type_id and object_id:
            queryset = Comment.objects.filter(content_type_id=content_type_id, object_id=object_id).select_related('user').order_by('time')
            return queryset
        return Comment.objects.none()









class CommentCreateAPIView(generics.CreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def perform_create(self, serializer):
        content_type_id = self.request.data.get('content_type')
        object_id = self.request.data.get('object_id')
        
        if not content_type_id or not object_id:
            raise serializers.ValidationError('content_type and object_id are required.')
        
        # Ensure content_type_id is valid
        try:
            content_type = ContentType.objects.get(pk=content_type_id)
        except ContentType.DoesNotExist:
            raise serializers.ValidationError('Invalid content_type.')

        # Save the comment with content_type and object_id
        serializer.save(user=self.request.user, content_type=content_type, object_id=object_id)






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