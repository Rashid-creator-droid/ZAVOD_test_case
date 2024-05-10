from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import (
    IsAuthenticatedOrReadOnly,
    IsAuthenticated,
    SAFE_METHODS,
)
from rest_framework.response import Response

from api_v1.serializers import (
    TagSerializer,
    PostSerializer,
    PostEditSerializer,
)
from posts.models import Tag, Post, Favorites
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .filters import PostFilter
from .permissions import ReadOnly


@extend_schema(
    tags=["Теги"],
    methods=["GET"],
    description="Все пользователи",
)
@extend_schema_view(
    list=extend_schema(
        summary="Получить список тегов",
    ),
    retrieve=extend_schema(
        summary="Детальная информация о теге",
    ),
)
class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [ReadOnly]
    http_method_names = ["get"]


@extend_schema(
    tags=["Посты"],
    methods=["GET", "POST", "DELETE"],
    description="Все пользователи",
)
@extend_schema_view(
    list=extend_schema(
        summary="Получить список постов",
    ),
    retrieve=extend_schema(
        summary="Детальная информация о посте",
    ),
)
class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = PostSerializer
    filterset_class = PostFilter
    pagination_class = LimitOffsetPagination
    http_method_names = ["delete", "post", "get"]

    def get_serializer_class(self):
        if self.request.method in SAFE_METHODS:
            return PostSerializer
        return PostEditSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=["get"])
    def view_post(self, request, pk=None):
        post = self.get_object()
        post.views_count += 1
        post.save()
        return Response({"message": "Просмотр поста увеличен на 1."})


@extend_schema(
    tags=["Лайки"],
    methods=["GET", "POST", "DELETE"],
    description="Все пользователи",
)
@api_view(["POST", "DELETE"])
@permission_classes([IsAuthenticated])
def add_favorite(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    if request.method == "POST":
        status = request.data.get("status", True)
        favorite, created = Favorites.objects.get_or_create(
            user=request.user,
            post=post,
        )

        if created or favorite.status != status:
            favorite.status = status
            favorite.save()

    elif request.method == "DELETE":
        Favorites.objects.filter(user=request.user, post=post).delete()

    post = Post.objects.get(id=post_id)
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        "post_likes_dislikes",
        {
            "type": "update_like_dislike_counts",
            "post_id": post.id,
            "like_count": post.favorite.filter(status=True).count(),
            "dislike_count": post.favorite.filter(status=False).count(),
        },
    )

    return JsonResponse({"message": f"Вы оценили пост {post.name}"})
