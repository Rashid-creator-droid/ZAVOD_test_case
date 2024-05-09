"""
ASGI config for news project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

from channels.layers import get_channel_layer
from channels.routing import ProtocolTypeRouter, URLRouter
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
