from rest_framework.response import Response
from rest_framework import status, views, pagination
from .models import Game
from .serializers import GameSerializer , Game_title_cracker_version_Serializer
from rest_framework.generics import RetrieveAPIView
from django.db.models import Q


class GameAPIView(views.APIView):
    def get(self, request):
        # Only select required fields and order by release_date, excluding games with a null image_path
        games = Game.objects.filter(~Q(image_path__isnull=True)).order_by('-release_date').values('id', 'title', 'image_path')

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






class GameSearchAPIView(views.APIView):
    def get(self, request):
        query = request.GET.get('q')
        if query:
            games = Game.objects.filter(Q(title__icontains=query) | Q(genres__icontains=query) & ~Q(image_path__isnull=True)).order_by('-release_date').values('id', 'title', 'image_path')
        else:
            games = Game.objects.none()

        # Pagination
        paginator = pagination.PageNumberPagination()
        paginator.page_size = 30
        result_page = paginator.paginate_queryset(games, request)

        # Serialize the queryset
        serializer = Game_title_cracker_version_Serializer(result_page, many=True)

        return paginator.get_paginated_response(serializer.data)

