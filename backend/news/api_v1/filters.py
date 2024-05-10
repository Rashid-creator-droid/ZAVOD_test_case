from django_filters.rest_framework import filters, FilterSet

from posts.models import Tag, Post


class PostFilter(FilterSet):
    tags = filters.ModelMultipleChoiceFilter(
        field_name="tag__slug",
        queryset=Tag.objects.all(),
        to_field_name="slug",
    )

    class Meta:
        model = Post
        fields = [
            "tag",
        ]
