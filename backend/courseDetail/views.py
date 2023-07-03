# from ..useAuth.models import Course, CourseDetail
from useAuth.models import Course, CourseDetail, Profile
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework import generics, permissions
import hashlib
import time
from useAuth.custom_permission import isStudent, isTeacher, isCourseOwner
from useAuth.serializers import CourseSerializer, CourseDetailSerializer
from useAuth.utility import generateData
from django.db import IntegrityError

def getCourse(cid, request):   
    return Course.objects.get(id = cid, owner__user = request.user, is_deleted = False)
    

class CourseDetailViewStudent(APIView):
    permission_classes = [permissions.IsAuthenticated, isStudent]

    # list of joined courses for students
    def get(self, request, cid=None):
        
        profile = Profile.objects.get(user = request.user)
    
        courseDetails = CourseDetail.objects.filter(student = profile)
    
        return Response(generateData("", False, CourseDetailSerializer(courseDetails, many=True).data), status=status.HTTP_200_OK)
        
    
    # to join a course
    def post(self, request):
        profile = Profile.objects.get(user = request.user)
        
        course = Course.objects.filter(token = request.data["token"], is_deleted=False).first()
        
        if course == None:
            return Response(generateData("Invalid Token", True, None), status=status.HTTP_404_NOT_FOUND)
        
        
        obj, created = CourseDetail.objects.get_or_create(student=profile, course=course)
        if created == False or obj.has_left == False:
            return Response(generateData("Already a member of this course", True, None), status=status.HTTP_302_FOUND)
        
        
        obj.has_left = False
        obj.save()

        return Response(generateData("", False, CourseSerializer(course).data), status=status.HTTP_200_OK)
    
    # leave a course 
    def delete(self, request, cid):

        courseDetails = CourseDetail.objects.get(student = request.user, course__id = cid)

        courseDetails.has_left = True
        courseDetails.save()

        return Response(generateData("", False, CourseDetailSerializer(courseDetails).data), status=status.HTTP_200_OK)


class CourseDetailViewTeacher(APIView):
    permission_classes = [permissions.IsAuthenticated, isTeacher, isCourseOwner]

    def get(self, request, cid):
        
        courseDetails = CourseDetail.objects.filter(course__id = cid, has_left=False)
        
        return Response(generateData("", False, CourseDetailSerializer(courseDetails, many=True).data), status=status.HTTP_200_OK)
    
      
    # leave a course 
    def delete(self, request, cid):

        uid = request.data["uid"]
        
        courseDetails = CourseDetail.objects.get(course__id = cid, student__user__id = uid)
        courseDetails.has_left = True
        courseDetails.save()

        return Response(generateData("", False, CourseDetailSerializer(courseDetails).data), status=status.HTTP_200_OK)
