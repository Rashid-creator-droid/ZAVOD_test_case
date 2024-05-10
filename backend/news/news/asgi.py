from channels.layers import get_channel_layer
from channels.routing import URLRouter
from channels.auth import AuthMiddlewareStack

import os
from channels.routing import ProtocolTypeRouter
from django.core.asgi import get_asgi_application

from api_v1 import routing

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "news.settings")

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": AuthMiddlewareStack(
            URLRouter(routing.websocket_urlpatterns)
        ),
    }
)
channel_layer = get_channel_layer()
