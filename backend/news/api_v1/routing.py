from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(
        r"ws/post_likes_dislikes/$",
        consumers.PostLikesDislikesConsumer.as_asgi(),
    ),
]
