from rest_framework import permissions


class ReadOnly(permissions.BasePermission):
    """Права доступа"""

    message = "Доступно только для чтения"

    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS

    def has_object_permission(self, request, view, obj):
        return request.method in permissions.SAFE_METHODS
