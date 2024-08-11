from rest_framework import views, pagination , status
from .models import Game
from .serializers import GameSerializer , Game_title_cracker_version_Serializer
from rest_framework.generics import RetrieveAPIView
from django.db.models import Q
from django.db.models.functions import Length
import Levenshtein
from rest_framework.response import Response
from datetime import datetime




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
            query_tokens = query.lower().split()

            # Fetch games that have a non-null image_path
            games = Game.objects.filter(
                ~Q(image_path__isnull=True)
            ).annotate(
                title_length=Length('title'),  # Annotate length of title
            ).values('id', 'title', 'image_path')

            games_with_scores = []

            for game in games:
                title_tokens = game['title'].lower().split()
                exact_match = any(query.lower() in game['title'].lower() for query in query_tokens)
                distance = Levenshtein.distance(game['title'].lower(), query.lower())
                dynamic_max_distance = max(3, len(game['title']) // 5)

                # Token-based matching
                token_matches = sum(1 for token in query_tokens if token in title_tokens)
                token_match_score = token_matches / len(query_tokens)

                if exact_match or distance <= dynamic_max_distance:
                    combined_score = (1 - distance / (dynamic_max_distance + 1)) * 0.5 + token_match_score * 0.5
                    games_with_scores.append({
                        'id': game['id'],
                        'title': game['title'],
                        'image_path': game['image_path'],
                        'exact_match': exact_match,
                        'distance': distance,
                        'token_match_score': token_match_score,
                        'combined_score': combined_score
                    })

            # Sort games by exact match priority, combined score, and title length proximity
            games_with_scores.sort(key=lambda x: (-x['exact_match'], -x['combined_score'], x['distance'], abs(len(x['title']) - len(query)), -x['id']))

            # Convert to a list of dictionaries for pagination
            games_sorted = [{'id': game['id'], 'title': game['title'], 'image_path': game['image_path']} for game in games_with_scores]
        else:
            games_sorted = []

        # Pagination
        paginator = pagination.PageNumberPagination()
        paginator.page_size = 30
        result_page = paginator.paginate_queryset(games_sorted, request, view=self)

        # Serialize the queryset
        serializer = Game_title_cracker_version_Serializer(result_page, many=True)

        return paginator.get_paginated_response(serializer.data)



from rest_framework import views, status
from rest_framework.response import Response
from .models import Game
from .serializers import GameSerializer
from django.db.models import Q
from django.utils.dateparse import parse_date
import Levenshtein

class NearestGamesView(views.APIView):
    def get(self, request, *args, **kwargs):
        # Get query parameters
        genres = request.GET.get('genres', '').split(',')
        title = request.GET.get('title', '').strip()
        date_str = request.GET.get('date', '').strip()

        # Clean up genres list
        genres = [genre.strip() for genre in genres if genre.strip()]
        
        # Initial queryset excluding games without an image_path
        games = Game.objects.filter(~Q(image_path__isnull=True))

        # List to store games with calculated scores
        games_list = []

        if title:
            query_tokens = title.lower().split()

            for game in games:
                if game.title:
                    title_tokens = game.title.lower().split()
                    distance = Levenshtein.distance(game.title.lower(), title.lower())
                    dynamic_max_distance = max(3, len(game.title) // 5)
                    token_matches = sum(1 for token in query_tokens if token in title_tokens)
                    token_match_score = token_matches / len(query_tokens)

                    combined_score = (1 - distance / (dynamic_max_distance + 1)) * 0.5 + token_match_score * 0.5
                    games_list.append({
                        'game': game,
                        'score': combined_score,
                        'distance': distance
                    })

            # Sort games by combined score and distance
            games_list.sort(key=lambda x: (-x['score'], x['distance']))

            # Keep only the top 10 unique games based on their IDs
            unique_games = {}
            for item in games_list:
                game = item['game']
                if game.id not in unique_games:
                    unique_games[game.id] = game
                elif game.release_date > unique_games[game.id].release_date:
                    unique_games[game.id] = game

            games = list(unique_games.values())[:20]

        # If fewer than 10 games, fetch more based on genres
        if len(games) < 20:
            additional_games = Game.objects.filter(
                ~Q(id__in=[game.id for game in games]), ~Q(image_path__isnull=True)
            )

            if genres:
                additional_games = additional_games.filter(genres__overlap=genres)

            additional_games = additional_games[:(20 - len(games))]
            games.extend(additional_games)

        # Ensure the final list of games is unique and capped at 10
        unique_games = {}
        for game in games:
            if game.id not in unique_games:
                unique_games[game.id] = game

        games = list(unique_games.values())[:20]

        # Serialize and return response
        serializer = GameSerializer(games, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)








class GameGenreAPIView(views.APIView):
    def get(self, request):
        query = request.GET.get('q')
        if query:
            games = Game.objects.filter((Q(genres__icontains=query)) & ~Q(image_path__isnull=True)).order_by('-release_date').values('id', 'title', 'image_path')
        else:
            games = Game.objects.none()

        paginator = pagination.PageNumberPagination()
        paginator.page_size = 30
        result_page = paginator.paginate_queryset(games, request, view=self)
        serializer = Game_title_cracker_version_Serializer(result_page, many=True)

        return paginator.get_paginated_response(serializer.data)
    

