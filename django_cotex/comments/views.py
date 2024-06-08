# comments/views.py
from rest_framework import generics, status
from rest_framework.response import Response
from .models import Comment
from .serializers import (
    CommentDetailSerializer,
    CommentLikeDislikeSerializer,
    CommentReplySerializer,
)







class CommentDetailAPIView(generics.ListAPIView):
    serializer_class = CommentDetailSerializer

    def get_queryset(self):
        game_id = self.request.query_params.get('game')
        if game_id:
            return Comment.objects.filter(game_id=game_id).select_related('user').order_by('time')
        return Comment.objects.none()







class CommentLikeDislikeAPIView(generics.GenericAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentLikeDislikeSerializer

    def post(self, request, pk):
        comment = self.get_object()
        action = request.data.get('action')

        if action == 'like':
            comment.likes += 1
        elif action == 'dislike':
            comment.dislikes += 1
        else:
            return Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)

        comment.save()
        serializer = self.get_serializer(comment)
        return Response(serializer.data)
    


class CommentReplyCreateAPIView(generics.CreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentReplySerializer

    def perform_create(self, serializer):
        parent_comment_pk = self.kwargs.get('pk')
        parent_comment = Comment.objects.get(pk=parent_comment_pk)
        serializer.save(user=self.request.user, parent=parent_comment)
