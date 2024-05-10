from django.urls import include, path
from rest_framework.routers import DefaultRouter

from api_v1.views import PostViewSet, TagViewSet, add_favorite
from users.views import SignUpd

app_name = "api_v1"

router = DefaultRouter()

router.register("users", SignUpd, basename="users"),
router.register("posts", PostViewSet, basename="posts")
router.register("tags", TagViewSet, basename="tags")

urlpatterns = [
    path(
        "posts/<int:post_id>/add_favorite/", add_favorite, name="add_favorite"
    ),
    path("", include(router.urls)),
    path("", include("djoser.urls")),
    path("auth/", include("djoser.urls.authtoken")),
]
