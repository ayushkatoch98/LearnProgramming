from django.contrib import admin
from django.urls import include, path
# from .views_course import CourseView
from .views import ModuleViewTeacher, ModuleViewStudent


urlpatterns = [
    path("teacher/<int:cid>/", ModuleViewTeacher.as_view(), name="module"),
    path("teacher/<int:cid>/<int:mid>/", ModuleViewTeacher.as_view()),

    path("student/<int:cid>/", ModuleViewStudent.as_view(), name='module'), # joining

]