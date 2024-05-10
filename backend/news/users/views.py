from djoser.serializers import SetPasswordSerializer
from djoser.views import UserViewSet
from rest_framework.decorators import action
from rest_framework.permissions import (
    IsAuthenticated,
    IsAuthenticatedOrReadOnly,
)
from rest_framework.response import Response
from django.urls import reverse_lazy
from django.views.generic import CreateView

from .forms import CreationForm
from core.pagination import LargeResultsSetPagination
from users.models import User
from .serializers import (
    MeSerializer,
    SignUpSerializer,
)


class SignUpd(UserViewSet):
    queryset = User.objects.all()
    pagination_class = LargeResultsSetPagination
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action == "set_password":
            return SetPasswordSerializer
        if self.action == "create":
            return MeSerializer
        return SignUpSerializer

    @action(
        detail=False,
        methods=["get"],
        url_path="me",
        permission_classes=[IsAuthenticated],
    )
    def me(self, request):
        serializer_class = MeSerializer
        if request.method == "GET":
            serializer = serializer_class(request.user, many=False)
            return Response(serializer.data)


class SignUp(CreateView):
    form_class = CreationForm
    success_url = reverse_lazy("posts:index")
    template_name = "users/signup.html"
