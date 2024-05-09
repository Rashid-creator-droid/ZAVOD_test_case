from djoser.serializers import UserCreateSerializer, UserSerializer

from users.models import User


class MeSerializer(UserCreateSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "password",
        ]
        required_fields = [
            "email",
            "username",
            "first_name",
            "last_name",
            "password",
        ]


class SignUpSerializer(UserSerializer):

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "username",
            "first_name",
            "last_name",
        ]
        read_only_fields = ["id"]

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
