from django.urls import include, path
from rest_framework.routers import DefaultRouter

from api_v1.views import PostViewSet

app_name = "api_v1"

router = DefaultRouter()

router.register("posts", PostViewSet, basename="posts")

urlpatterns = [
    path("", include(router.urls)),
    # path('', include('djoser.urls')),
    # path('auth/', include('djoser.urls.authtoken')),
]
