from rest_framework import viewsets

from api_v1.serializers import TagSerializer, PostSerializer
from posts.models import Tag, Post

from .permissions import ReadOnly


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [ReadOnly]


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    permission_classes = [ReadOnly]
    serializer_class = PostSerializer
