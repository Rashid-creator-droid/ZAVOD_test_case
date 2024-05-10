from django.shortcuts import render, get_object_or_404
from .models import Post, Ip
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from django.shortcuts import render
from django.http import JsonResponse
import requests
from django.db import models
from posts.models import Post, Favorites
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


def index(request):
    last_posts = 3
    page_obj = Post.objects.all()[:last_posts]

    context = {
        "page_obj": page_obj,
    }
    return render(request, "posts/index.html", context)


def get_client_ip(request):
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        ip = x_forwarded_for.split(",")[0]
    else:
        ip = request.META.get(
            "REMOTE_ADDR"
        )  # В REMOTE_ADDR значение айпи пользователя
    return ip


def post_detail(request, post_id):
    # Отправляем запрос к API для получения информации о посте
    post = get_object_or_404(Post, pk=post_id)
    response = requests.get(f"http://127.0.0.1:8001/api/posts/{post_id}/")
    ip = get_client_ip(request)
    if Ip.objects.filter(ip=ip).exists():
        post.views.add(Ip.objects.get(ip=ip))
    else:
        Ip.objects.create(ip=ip)
        post.views.add(Ip.objects.get(ip=ip))

    post_data = response.json()
    # Передаем информацию о посте в шаблон
    return render(request, "posts/post_detail.html", {"post": post_data})


@login_required
def load_more(request):
    offset = int(request.GET.get("offset", 0))
    limit = int(request.GET.get("limit", 0))
    posts = Post.objects.annotate(
        like_count=models.Count(
            "favorite", filter=models.Q(favorite__status=True)
        ),
        dislike_count=models.Count(
            "favorite", filter=models.Q(favorite__status=False)
        ),
    ).all()[offset : offset + limit]

    data = [
        {
            "id": post.id,
            "name": post.name,
            "text": post.text,
            "image": post.image.url,
            "first_name": post.author.first_name,
            "last_name": post.author.last_name,
            "pub_date": post.pub_date,
            "like_count": post.like_count,
            "dislike_count": post.dislike_count,
        }
        for post in posts
    ]
    return JsonResponse(data, safe=False)


@api_view(["POST", "DELETE"])
@login_required()
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
