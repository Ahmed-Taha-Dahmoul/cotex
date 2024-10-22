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
        fields = ['email', 'username', 'profile_pic', 'is_active', 'is_staff', 'full_name', 'about', 'phone', 'street', 'city', 'state', 'zip_code']
        read_only_fields = ['profile_pic']  # Make profile_pic read-only


from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError


class PasswordChangeSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = self.context['request'].user
        if not user.check_password(data['current_password']):
            raise serializers.ValidationError({'current_password': 'Current password is incorrect.'})

        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'New password and confirm password do not match.'})

        try:
            validate_password(data['new_password'], user)
        except ValidationError as e:
            raise serializers.ValidationError({'new_password': e.messages})

        return data

    def save(self):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()