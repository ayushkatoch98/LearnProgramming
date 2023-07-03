from django.contrib import admin
from django.urls import include, path
# from .views_course import CourseView
from .views import CourseDetailViewStudent, CourseDetailViewTeacher
urlpatterns = [
    path("teacher/<int:cid>/", CourseDetailViewTeacher.as_view(), name='course'), # joining
    path("student/", CourseDetailViewStudent.as_view(), name='course'), # joining
    path("student/<int:cid>/", CourseDetailViewStudent.as_view(), name='course'), # joining
]