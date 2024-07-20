from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, login, logout 
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer
from .serializers import CustomUserSerializer , CustomUserSerializer_all
from django.db import IntegrityError



from rest_framework.permissions import IsAuthenticated



class RegisterAPIView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user': UserSerializer(user).data
                }, status=status.HTTP_201_CREATED)
            except IntegrityError as e:
                # Handle the case where the email already exists
                if 'unique constraint' in str(e).lower():
                    return Response({'email': 'This email is already registered.'}, status=status.HTTP_400_BAD_REQUEST)
                return Response({'detail': 'An error occurred during registration.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginAPIView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        login(request, user)  # Make sure `login` is imported and defined
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
        })






    

class UserInfoView(APIView):

    permission_classes = [IsAuthenticated]
    
    def get(self, request, format=None):
        user = request.user
        serializer = CustomUserSerializer(user)
        return Response(serializer.data)
    











class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = CustomUserSerializer_all(user)
        return Response(serializer.data)

    def put(self, request):
        user = request.user
        serializer = CustomUserSerializer_all(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        print(serializer.errors)  # Log the errors to the console
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




