from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Comment
from .serializers import CommentDetailSerializer, CommentCreateSerializer

class CommentListAPIView(generics.ListAPIView):
    serializer_class = CommentDetailSerializer
    def get_queryset(self):
        game_id = self.request.query_params.get('game')
        if game_id:
            queryset = Comment.objects.filter(game_id=game_id).select_related('user').order_by('time')
            return queryset
        return Comment.objects.none()

class CommentCreateAPIView(generics.CreateAPIView):
    serializer_class = CommentCreateSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
