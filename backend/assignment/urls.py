from django.contrib import admin
from django.urls import include, path
# from .views_course import CourseView
from .views import AssignmentViewStudent, AssignmentViewTeacher, CodeRun
urlpatterns = [
    path("teacher/<int:cid>/", AssignmentViewTeacher.as_view(), name='Assignment'), # retrive and posting
    path("teacher/<int:cid>/<int:aid>/", AssignmentViewTeacher.as_view(), name='Assignment'), # retrive and posting


    # path("student/", AssignmentViewStudent.as_view({'get': 'retrieve'}), name='Assignment'), # joining
    path("student/<int:cid>/", AssignmentViewStudent.as_view(), name='Assignment'), # joining
    path("student/<int:cid>/<int:aid>/", AssignmentViewStudent.as_view(), name='Assignment'), # joining

    # path("student/<int:cid>/<int:aid>/code/", CodeRun.as_view(), name='Assignment'), # joining

    
    # path('test/modelA', views.Test.as_view({'post': 'post_modelA'})),
    # path('test/modelB', views.Test.as_view({'post': 'post_modelB'})),

]