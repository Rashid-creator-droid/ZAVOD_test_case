from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from posts.models import Favorites


@receiver(post_save, sender=Favorites)
@receiver(post_delete, sender=Favorites)
def update_like_dislike_counts(sender, instance, **kwargs):
    post = instance.post
    like_count = Favorites.objects.filter(post=post, status=True).count()
    dislike_count = Favorites.objects.filter(post=post, status=False).count()
    post.like_count = like_count
    post.dislike_count = dislike_count
    post.save()
    print("ZHOPA")
    # Отправка обновленных данных по веб-сокетам
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        "post_likes_dislikes",
        {
            "type": "update_like_dislike_counts",
            "post_id": post.id,
            "like_count": like_count,
            "dislike_count": dislike_count,
        },
    )
