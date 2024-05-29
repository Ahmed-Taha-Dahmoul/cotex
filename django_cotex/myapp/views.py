from rest_framework.response import Response
from rest_framework import status, views, pagination
from .models import Game
from .serializers import GameSerializer , Game_title_cracker_version_Serializer
from rest_framework.generics import RetrieveAPIView

class GameAPIView(views.APIView):
    def get(self, request):
        # Only select required fields and order by release_date
        games = Game.objects.all().order_by('-release_date').values('id','title', 'cracker', 'version','image_url')

        # Pagination
        paginator = pagination.PageNumberPagination()
        paginator.page_size = 30
        result_page = paginator.paginate_queryset(games, request)

        # Serialize the queryset
        serializer = Game_title_cracker_version_Serializer(result_page, many=True)

        return paginator.get_paginated_response(serializer.data)

class GameDetailsAPIView(RetrieveAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    lookup_field = 'id'