from django.contrib import admin
from django.urls import include, path
from .views import GroupView

urlpatterns = [
    # path("login/", LoginAPI.as_view(), name='login'),
    # path("dashboard/", CourseView.as_view(), name="course"),
    # path("dashboard/<int:id>/", CourseView.as_view(), name="course")
    path("teacher/<int:cid>/", GroupView.as_view(), name="group"),
    path("student/<int:cid>/", GroupView.as_view(), name="group"),
    # path("teacher/", GroupView.as_view(), name="group")
]