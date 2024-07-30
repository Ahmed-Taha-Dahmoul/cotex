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



from django.db.models import Count, F, Q
from rest_framework import status, views
from rest_framework.response import Response
from .models import Game
from .serializers import Game_title_cracker_version_Serializer
from datetime import datetime
from django.utils.dateparse import parse_date
from datetime import timedelta



class NearestGamesView(views.APIView):
    def get(self, request, *args, **kwargs):
        # Get query parameters
        genres = request.GET.get('genres', '').split(',')
        title = request.GET.get('title', '').strip()
        date_str = request.GET.get('date', '').strip()

        # Ensure genres are properly formatted
        genres = [genre.strip() for genre in genres if genre.strip()]

        # Parse the date
        release_date = parse_date(date_str) if date_str else None

        # Initialize QuerySet
        games = Game.objects.filter(~Q(image_path__isnull=True))

        # Apply title filter for the nearest match
        if title:
            query_tokens = title.lower().split()
            games_list = []

            for game in games:
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

            # Extract game objects and ensure at most 10 results
            game_ids = [item['game'].id for item in games_list[:10]]
            games = Game.objects.filter(id__in=game_ids)
        else:
            games = Game.objects.filter(~Q(image_path__isnull=True))

        # Remove duplicates, keeping only the most recent release
        unique_games = {}
        for game in games:
            if game.title in unique_games:
                if game.release_date > unique_games[game.title].release_date:
                    unique_games[game.title] = game
            else:
                unique_games[game.title] = game

        games = list(unique_games.values())

        # Fetch additional games if fewer than 10
        if len(games) < 10:
            # Find additional games based on genres
            additional_games = Game.objects.filter(~Q(id__in=[game.id for game in games]), ~Q(image_path__isnull=True))

            # Apply genres filter
            if genres:
                additional_games = additional_games.filter(genres__overlap=genres)

            # Fetch additional games to ensure at least 10 results
            additional_games = additional_games[:(10 - len(games))]

            # Add more games if still not enough
            if len(additional_games) < (10 - len(games)):
                # Fetch games without any filter if needed to fill up to 10
                additional_games = Game.objects.filter(~Q(id__in=[game.id for game in games + list(additional_games)]), ~Q(image_path__isnull=True))[:(10 - len(games))]

            games.extend(additional_games)

        # Ensure no more than 10 results and deduplicate
        unique_games = {}
        for game in games:
            if game.title in unique_games:
                if game.release_date > unique_games[game.title].release_date:
                    unique_games[game.title] = game
            else:
                unique_games[game.title] = game

        games = list(unique_games.values())[:10]

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
    

