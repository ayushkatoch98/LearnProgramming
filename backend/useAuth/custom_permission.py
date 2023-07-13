from .models import Module, ModuleGroup, Profile, Course, CourseDetail, Assignment

from rest_framework import generics, permissions

class isCourseOwner(permissions.BasePermission):
    message = 'You are not the course owner'

    def has_permission(self, request, view):
        cid = view.kwargs.get('cid', None)
        a = Course.objects.filter(id=cid, owner__user = request.user, is_deleted=False).first()
        return a != None
    
class isInCourse(permissions.BasePermission):
    message = 'You are not in this course'

    def has_permission(self, request, view):
        cid = view.kwargs.get('cid', None)
        a = CourseDetail.objects.filter(student__user = request.user, course__id = cid, has_left=False, request_accepted=True).first()
        
        return a != None
    
class isTeacher(permissions.BasePermission):
    message = 'You dont have a teacher account'

    def has_permission(self, request, view):
        profile = Profile.objects.get(user = request.user)
        return profile.group == "TEACHER"
    
class isStudent(permissions.BasePermission):
    message = 'You dont have a student account'

    def has_permission(self, request, view):
        profile = Profile.objects.get(user = request.user)
        return profile.group == "STUDENT"
    