from django.shortcuts import render
from useAuth.models import Module, ModuleGroup, Profile, Course, CourseDetail, AssignmentSubmission
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework import generics, permissions
import hashlib
import time
from useAuth.custom_permission import isTeacher, isStudent, isCourseOwner, isInCourse
from useAuth.utility import generateData
from useAuth.serializers import ModuleGroupSerializer, AssignmentSubmissionSerializer

# Create your views here.

class SubmissionView(APIView):
    permission_classes = [permissions.IsAuthenticated, isTeacher, isCourseOwner]

    def get(self, request, cid, aid, sid = None):
        # sid is submission id
        submissions = []
        totalStudents = 0

        data = {
            "total_students": totalStudents,
            "total_submissions": len(submissions),
            "data" : []
        }

        if sid == None:
            submissions = AssignmentSubmission.objects.filter(assignment__id = aid)
            totalStudents = len(CourseDetail.objects.filter(course__id = cid))
        else:
            submissions = AssignmentSubmission.objects.filter(assignment__id = aid, id = sid)
        
        if len(submissions) == 0:
            return Response(generateData("Group List", False, data), status=status.HTTP_200_OK)
        
        data["data"] = AssignmentSubmissionSerializer(submissions, many=True).data
        return Response(generateData("Group List", False, data), status=status.HTTP_200_OK)
    
