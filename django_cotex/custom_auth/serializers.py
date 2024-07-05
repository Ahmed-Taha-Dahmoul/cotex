from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken
from django.contrib.auth import logout




User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'profile_pic')

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Invalid Credentials")




class LogoutAPIView(APIView):
    def post(self, request):
        try:
            # Blacklist the current user's token if it exists
            token = request.auth
            if token:
                OutstandingToken.objects.get(token=token).blacklist()
        except OutstandingToken.DoesNotExist:
            pass  # Token doesn't exist, no need to blacklist
        except Exception as e:
            return Response({'error': 'Failed to blacklist token'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Logout the user
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'username', 'profile_pic')




class CustomUserSerializer_all(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'username', 'profile_pic', 'is_active', 'is_staff', 'full_name',"about",'phone', 'street', 'city', 'state', 'zip_code']

