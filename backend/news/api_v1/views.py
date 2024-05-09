from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.pagination import (
    PageNumberPagination,
)
from rest_framework.permissions import (
    IsAuthenticatedOrReadOnly,
    IsAuthenticated,
)

from api_v1.serializers import TagSerializer, PostSerializer
from posts.models import Tag, Post, Favorites
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .permissions import ReadOnly


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [ReadOnly]


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = PostSerializer
    pagination_class = PageNumberPagination


# class FavoriteViewSet(viewsets.ModelViewSet):
#     queryset = Favorites.objects.all()
#     permission_classes = [IsAuthenticatedOrReadOnly]
#
#     def get_serializer_class(self):
#         if self.request.method in SAFE_METHODS:
#             return RecipeSerializer
#         return RecipeEditSerializer


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
