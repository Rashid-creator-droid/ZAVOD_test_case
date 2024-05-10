from django.contrib.auth import get_user_model
from django.db import models
from django.db.models import DateTimeField


User = get_user_model()


class Ip(models.Model):  # наша таблица где будут айпи адреса
    ip = models.CharField(max_length=100)


def __str__(self):
    return self.ip


class Tag(models.Model):
    name = models.CharField(
        verbose_name="Название",
        max_length=200,
        unique=True,
    )
    slug = models.SlugField(
        max_length=200,
        unique=True,
        verbose_name="Ссылка",
    )

    class Meta:
        verbose_name = "Тег"
        verbose_name_plural = "Теги"

    def __str__(self):
        return self.name


class Post(models.Model):
    name = models.CharField(
        verbose_name="Название",
        max_length=200,
    )
    author = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name="post",
        verbose_name="Автор",
    )
    text = models.TextField(verbose_name="Описание", max_length=1000)
    image = models.ImageField(
        verbose_name="Картинка",
        upload_to="posts/images",
    )
    tag = models.ManyToManyField(
        Tag,
        verbose_name="Тег",
        related_name="post",
    )
    pub_date = DateTimeField(
        verbose_name="Дата публикации",
        auto_now_add=True,
    )
    views = models.ManyToManyField(Ip, related_name="post_views", blank=True)

    class Meta:
        verbose_name = "Пост"
        verbose_name_plural = "Посты"
        ordering = ["-pub_date"]

    def __str__(self):
        return self.name


class Favorites(models.Model):
    user = models.ForeignKey(
        User,
        related_name="favorite",
        on_delete=models.CASCADE,
    )
    post = models.ForeignKey(
        Post,
        related_name="favorite",
        on_delete=models.CASCADE,
    )
    status = models.BooleanField(
        default=None,
        null=True,
        blank=True,
    )

    class Meta:
        verbose_name = "Избранное"
        verbose_name_plural = "Избранное"
        ordering = ["id"]
        constraints = [
            models.UniqueConstraint(
                fields=["user", "post"], name="uniquefavorit"
            ),
        ]
