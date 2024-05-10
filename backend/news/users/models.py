from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.db import models


class User(AbstractUser):
    username = models.CharField(
        verbose_name="Логин",
        max_length=150,
        unique=True,
        validators=[
            RegexValidator(
                regex=r"^[\w.@+-]+",
                message="ИСпользуйте допустимые символы в username",
            ),
        ],
    )
    email = models.EmailField(
        verbose_name="Email",
        max_length=254,
        unique=True,
    )
    first_name = models.CharField(
        verbose_name="Имя",
        max_length=150,
    )
    last_name = models.CharField(
        verbose_name="Фамилия",
        max_length=150,
    )

    class Meta:
        ordering = ["id"]
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователи"

    def __str__(self):
        return f"Никнейм: {self.username}. Почта: {self.email}"
