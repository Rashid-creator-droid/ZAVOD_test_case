from channels.generic.websocket import AsyncWebsocketConsumer
import json


class PostLikesDislikesConsumer(AsyncWebsocketConsumer):
    """Обработка соединение WS"""

    async def connect(self):
        self.group_name = "post_likes_dislikes"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name, self.channel_name
        )

    async def update_like_dislike_counts(self, event):
        post_id = event["post_id"]
        like_count = event["like_count"]
        dislike_count = event["dislike_count"]
        await self.send(
            text_data=json.dumps(
                {
                    "post_id": post_id,
                    "like_count": like_count,
                    "dislike_count": dislike_count,
                }
            )
        )
