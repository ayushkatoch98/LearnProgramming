from django.contrib import admin
from django.urls import include, path
from .views import SubmissionView, SubmissionViewStudent, GraphViewTeacher

urlpatterns = [
    # path("login/", LoginAPI.as_view(), name='login'),
    # path("dashboard/", CourseView.as_view(), name="course"),
    # path("dashboard/<int:id>/", CourseView.as_view(), name="course")

    path("teacher/<int:cid>/<int:aid>/", SubmissionView.as_view(), name="group"),
    path("student/<int:cid>/<int:aid>/", SubmissionViewStudent.as_view(), name="group"),
    path("teacher/<int:cid>/<int:aid>/<int:sid>/", SubmissionView.as_view(), name="group"),
    path("teacher/graph/<int:cid>/", GraphViewTeacher.as_view(), name="graphs")
    # path("teacher/", GroupView.as_view(), name="group")
]