from django.urls import path
from . import views

app_name = "posts"

urlpatterns = [
    path("", views.index, name="index"),
    path("api/load_more/", views.load_more, name="load_more"),
    path("post_detail/<int:post_id>/", views.post_detail, name="post_detail"),
]
