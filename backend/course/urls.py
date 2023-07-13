from django.contrib import admin
from django.urls import include, path
# from .views_course import CourseView
from .views import CourseViewTeacher, CourseViewStudent, CourseViewCopyTeacher
urlpatterns = [
    path("teacher/", CourseViewTeacher.as_view(), name='course'), # joining
    path("teacher/<int:cid>/", CourseViewTeacher.as_view(), name='course'), # joining
    path("teacher/copy/<int:cid>/", CourseViewCopyTeacher.as_view(), name='course'), # joining

    path("student/", CourseViewStudent.as_view(), name='course'), # joining
    path("student/<int:cid>/", CourseViewStudent.as_view(), name='course'), # joining

]