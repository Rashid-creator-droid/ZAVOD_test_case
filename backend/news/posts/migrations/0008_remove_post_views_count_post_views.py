# Generated by Django 4.2 on 2024-05-10 17:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("posts", "0007_ip"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="post",
            name="views_count",
        ),
        migrations.AddField(
            model_name="post",
            name="views",
            field=models.ManyToManyField(
                blank=True, related_name="post_views", to="posts.ip"
            ),
        ),
    ]