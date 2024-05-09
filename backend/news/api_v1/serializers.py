from drf_extra_fields.fields import Base64ImageField
from rest_framework import serializers

from posts.models import Tag, Post


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = [
            "id",
            "name",
            "slug",
        ]


class PostSerializer(serializers.ModelSerializer):
    tags = TagSerializer(read_only=True, many=True)
    image = Base64ImageField()

    class Meta:
        model = Post
        fields = [
            "id",
            "tags",
            "author",
            "name",
            "image",
            "text",
        ]
