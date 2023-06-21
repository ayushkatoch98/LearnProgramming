from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("auth/", include("useAuth.urls")),
    path("course/", include("course.urls")),
    path("module/", include("module.urls")),
    path("assignment/", include("assignment.urls")),
    path("group/", include("group.urls")),
    path("admin/", admin.site.urls),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)