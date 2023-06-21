from django.contrib import admin
from django.urls import include, path
from .views import LoginAPI, AccountView, IsAuthenticated
# from .views_course import CourseView

urlpatterns = [
    path("login/", LoginAPI.as_view(), name='login'),
    path("register/", AccountView.as_view(), name='register'),
    path("isAuthenticated/", IsAuthenticated.as_view(), name='isAuthenticated'),
    # path("dashboard/", CourseView.as_view(), name="course"),
    # path("dashboard/<int:id>/", CourseView.as_view(), name="course")
]