# Generated by Django 4.2 on 2024-05-10 17:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("posts", "0006_post_views_count"),
    ]

    operations = [
        migrations.CreateModel(
            name="Ip",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("ip", models.CharField(max_length=100)),
            ],
        ),
    ]