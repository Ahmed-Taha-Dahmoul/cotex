from rest_framework.response import Response
from rest_framework import status, views, pagination
from .models import Game
from .serializers import GameSerializer

class GameAPIView(views.APIView):
    def get(self, request):
        games = Game.objects.all().order_by('-release_date')
        paginator = pagination.PageNumberPagination()
        paginator.page_size = 30
        result_page = paginator.paginate_queryset(games, request)
        serializer = GameSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)
