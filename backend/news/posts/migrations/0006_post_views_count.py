# Generated by Django 4.2 on 2024-05-10 17:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("posts", "0005_remove_favorites_favoriteuniq"),
    ]

    operations = [
        migrations.AddField(
            model_name="post",
            name="views_count",
            field=models.PositiveIntegerField(default=0),
        ),
    ]