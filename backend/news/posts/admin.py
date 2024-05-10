from django.contrib import admin
from django.utils.safestring import mark_safe

from posts.models import Tag, Post, Favorites, Ip


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = (
        "pk",
        "name",
        "slug",
    )
    search_fields = ("name",)


@admin.register(Ip)
class IpAdmin(admin.ModelAdmin):
    list_display = (
        "pk",
        "ip",
    )


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "author",
        "preview",
        "favorite_count",
    )
    search_fields = (
        "name",
        "author__username",
        "tag__name",
    )
    list_filter = (
        "name",
        "author__username",
        "tag__name",
    )

    def preview(self, obj):
        return mark_safe(
            f'<img src="{obj.image.url}" style="max-height: 50px;">'
        )

    def favorite_count(self, obj):
        return obj.favorite.count()


@admin.register(Favorites)
class FavoritesAdmin(admin.ModelAdmin):
    list_display = ("post", "user", "status")
