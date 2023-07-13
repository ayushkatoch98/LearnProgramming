from django.contrib import admin
from django.urls import include, path
from .views import GradeView, GradeViewStudent

urlpatterns = [
    # path("login/", LoginAPI.as_view(), name='login'),
    # path("dashboard/", CourseView.as_view(), name="course"),
    # path("dashboard/<int:id>/", CourseView.as_view(), name="course")
    # path("teacher/<int:cid>/<int:aid>/", GradeView.as_view(), name="group"),
    path("teacher/<int:cid>/<int:aid>/<int:sid>/", GradeView.as_view(), name="group"),
    path("student/<int:cid>/<int:aid>/", GradeViewStudent.as_view(), name="group"),
    # path("teacher/", GroupView.as_view(), name="group")
]