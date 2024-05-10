from django.db.models import Count
from .models import Ip, Post
from django.shortcuts import get_object_or_404, render
import requests


def index(request):
    """Главная страница"""
    return render(request, "posts/index.html")


def get_client_ip(request):
    """Получение  IP"""
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        ip = x_forwarded_for.split(",")[0]
    else:
        ip = request.META.get("REMOTE_ADDR")
    return ip


def top_views(request):
    """Статистика просмотров"""
    total_views = sum(post.views.count() for post in Post.objects.all())
    top_posts = Post.objects.annotate(num_views=Count("views")).order_by(
        "-num_views"
    )[:3]
    return render(
        request,
        "posts/top_views.html",
        {"total_views": total_views, "top_posts": top_posts},
    )


def post_detail(request, post_id):
    """Страница 1 поста"""
    post = get_object_or_404(Post, pk=post_id)
    response = requests.get(f"http://127.0.0.1:8001/api/posts/{post_id}/")
    ip = get_client_ip(request)

    if Ip.objects.filter(ip=ip).exists():
        post.views.add(Ip.objects.get(ip=ip))
    else:
        Ip.objects.create(ip=ip)
        post.views.add(Ip.objects.get(ip=ip))

    post_data = response.json()

    return render(request, "posts/post_detail.html", {"post": post_data})
