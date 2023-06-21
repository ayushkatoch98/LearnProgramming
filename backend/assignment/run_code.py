from useAuth.models import Profile, Course, CourseDetail, Assignment, AssignmentGroup, AssignmentSubmission, AssignmentCode
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework import generics, permissions
import hashlib
import time
from useAuth.custom_permission import isStudent, isTeacher, isInCourse, isCourseOwner
import tempfile



def run_code(code):
    
    f = tempfile.TemporaryFile()
    f.write()
