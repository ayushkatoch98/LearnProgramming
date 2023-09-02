from django.contrib import admin
from django.urls import include, path
from .views import LoginAPI, AccountView, IsAuthenticated, ProfileView
# from .views_course import CourseView

urlpatterns = [
    path("login/", LoginAPI.as_view(), name='login'),
    path("register/", AccountView.as_view(), name='register'),
    path("isAuthenticated/", IsAuthenticated.as_view(), name='isAuthenticated'),
    path("profile/<int:uid>/", ProfileView.as_view(), name='Something')
    # path("dashboard/", CourseView.as_view(), name="course"),
    # path("dashboard/<int:id>/", CourseView.as_view(), name="course")
]