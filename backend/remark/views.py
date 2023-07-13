from useAuth.models import Profile, Course, CourseDetail, Assignment, AssignmentSubmission, AssignmentCode, AssignmentRemark
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework import generics, permissions
import hashlib
import time
from useAuth.custom_permission import isStudent, isTeacher, isInCourse, isCourseOwner
from useAuth.utility import generateData
from useAuth.serializers import AssignmentRemarkSerializer, AssignmentSubmissionSerializer

class GradeViewStudent(APIView):

    permission_classes = [permissions.IsAuthenticated, isStudent, isInCourse]

    def get(self, request, cid, aid):

        profile = Profile.objects.get(user__id = request.user.id)
        submission = AssignmentSubmission.objects.filter(assignment__id = aid, student = profile).first()

        if submission == None:
            print("KEKEKEK")
            return Response(generateData("You didn't submit the assignment", True), status=status.HTTP_404_NOT_FOUND)    
        

        remark = AssignmentRemark.objects.filter(submission = submission).first()

        return Response(generateData("Your assignment remark", False, AssignmentRemarkSerializer(remark).data), status=status.HTTP_200_OK)
    

class GradeView(APIView):

    permission_classes = [permissions.IsAuthenticated, isTeacher, isCourseOwner]

    
    def get(self, request, cid, aid, sid):
        # sid = submission id 
        remark = AssignmentRemark.objects.filter(submission__id = sid, submission__assignment__id = aid).first()

        data = generateData("" , False, AssignmentRemarkSerializer(remark).data)

        return Response(data, status=status.HTTP_200_OK)
    
    # uid is user id 
    def post(self, request, cid, aid, sid):

        # course = Course.objects.filter(id = cid).first()
        # studentProfile = Profile.objects.get(user__id = uid)
        submission = AssignmentSubmission.objects.get(id = sid)
        remark = AssignmentRemark.objects.filter(submission = submission, submission__assignment__id = aid).first()

        remark.is_final_remark = True
        remark.code_remark = request.data["code_remark"]
        remark.report_remark = request.data["report_remark"]
        remark.report_score = request.data["report_score"]
        remark.code_quality = request.data["code_quality"]
        submission.graded = True
        submission.save()
        remark.save()
     
        return Response(generateData("Remark saved", False, AssignmentRemarkSerializer(remark).data), status=status.HTTP_200_OK)
    