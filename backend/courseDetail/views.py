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
    permission_classes = [permissions.IsAuthenticated, isStudent|isTeacher]

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
            return Response(generateData("Invalid Token / Course doesn't exists anymore", True, None), status=status.HTTP_404_NOT_FOUND)
        
        acceptedDomain = course.accepted_domain
        userDomain = "@" + request.user.email.split("@")[1]

        
        obj, created = CourseDetail.objects.get_or_create(student=profile, course=course)
        if created == False and obj.has_left == False:
            if obj.request_accepted == False:
                return Response(generateData("Awaiting join request to be accepted", True, None), status=status.HTTP_302_FOUND)
            return Response(generateData("Already a member of this course", True, None), status=status.HTTP_302_FOUND)
        
        obj.has_left = False

        if (acceptedDomain != userDomain):
            obj.request_accepted = False
            obj.save()
            return Response(generateData("Domain doesnt match, join request sent!" + acceptedDomain, True, None), status=status.HTTP_302_FOUND)

        obj.save()

        return Response(generateData("You are now a part of this course", False, CourseSerializer(course).data), status=status.HTTP_200_OK)
    
    # leave a course 
    def delete(self, request, cid):

        courseDetails = CourseDetail.objects.get(student = request.user, course__id = cid)

        courseDetails.has_left = True
        courseDetails.request_accepted = False
        courseDetails.save()

        return Response(generateData("", False, CourseDetailSerializer(courseDetails).data), status=status.HTTP_200_OK)


class CourseDetailViewTeacher(APIView):
    permission_classes = [permissions.IsAuthenticated, isTeacher, isCourseOwner]

    def get(self, request, cid):
        
        courseDetails = CourseDetail.objects.filter(course__id = cid, has_left=False)
        
        return Response(generateData("", False, CourseDetailSerializer(courseDetails, many=True).data), status=status.HTTP_200_OK)
    
    def post(self, request, cid):
        uid = request.data["uid"]
        request_accepted = request.data["request_accepted"]

        
        if request_accepted == "true":
            request_accepted = True
        else:
            request_accepted = False


        detail = CourseDetail.objects.filter( course__id = cid, student__id = uid).first()
        
        if detail == None:
            return Response(generateData("User not found", True, None), status=status.HTTP_404_NOT_FOUND)
        
        detail.request_accepted = request_accepted
        detail.has_left = False

        detail.save()

        message = "Request Accepted"
        if request_accepted == False:
            message = "Request Denined"

        return Response(generateData(message, False, CourseDetailSerializer(detail).data), status=status.HTTP_200_OK)
        


    # leave a course 
    def delete(self, request, cid):

        uid = request.data["uid"]
        
        courseDetails = CourseDetail.objects.get(course__id = cid, student__user__id = uid)
        courseDetails.has_left = True
        courseDetails.request_accepted = False
        courseDetails.save()

        return Response(generateData("User removed from the course", False, CourseDetailSerializer(courseDetails).data), status=status.HTTP_200_OK)
