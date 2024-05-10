from drf_extra_fields.fields import Base64ImageField
from rest_framework import serializers


from posts.models import Tag, Post, Favorites
from users.serializers import MeSerializer


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = [
            "id",
            "name",
            "slug",
        ]


class PostSerializer(serializers.ModelSerializer):

    image = Base64ImageField()
    is_favorited = serializers.SerializerMethodField("get_is_favorited")
    author = MeSerializer(read_only=True)
    tag = TagSerializer(many=True)
    like_count = serializers.SerializerMethodField("get_like_count")
    dislike_count = serializers.SerializerMethodField("get_dislike_count")
    views_count = serializers.SerializerMethodField("get_views_count")

    class Meta:
        model = Post
        fields = [
            "id",
            "tag",
            "author",
            "name",
            "image",
            "text",
            "is_favorited",
            "like_count",
            "dislike_count",
            "pub_date",
            "views_count",
        ]

    def get_views_count(self, obj):
        return obj.views.count()

    def get_is_favorited(self, obj):
        request = self.context.get("request")
        if request:
            user = request.user
            if user.is_authenticated:
                try:
                    favorite = obj.favorite.get(user=user)
                    return favorite.status
                except Favorites.DoesNotExist:
                    return None
        return None

    def get_like_count(self, obj):
        return Favorites.objects.filter(status=True, post=obj).count()

    def get_dislike_count(self, obj):
        return Favorites.objects.filter(status=False, post=obj).count()


class PostEditSerializer(serializers.ModelSerializer):
    image = Base64ImageField(
        max_length=None,
        use_url=True,
    )
    author = serializers.PrimaryKeyRelatedField(
        read_only=True,
    )

    class Meta:
        model = Post
        fields = "__all__"

    def create(self, validated_data):
        tag = validated_data.pop("tag")
        recipe = Post.objects.create(**validated_data)
        recipe.tag.set(tag)
        return recipe
