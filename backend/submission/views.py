from django.shortcuts import render
from useAuth.models import Module, ModuleGroup, Profile, Course, AssignmentRemark, CourseDetail, AssignmentSubmission, Assignment
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework import generics, permissions
import hashlib
import time
from useAuth.custom_permission import isTeacher, isStudent, isCourseOwner, isInCourse
from useAuth.utility import generateData
from useAuth.serializers import ModuleGroupSerializer, AssignmentSubmissionSerializer, AssignmentSerializer

# Create your views here.


class SubmissionViewStudent(APIView):
    permission_classes = [permissions.IsAuthenticated, isStudent|isTeacher, isInCourse]

    def get(self, request, cid, aid):
        
        profile = Profile.objects.get(user__id = request.user.id)

        assignments = Assignment.objects.filter(course__id = cid, id = aid, is_deleted=False)

        data = {
            "submitted": "",
            "data": [],
        }

        submission = AssignmentSubmission.objects.filter(student=profile, assignment=assignments.first()).first()

        assignments = assignments.first()

        data = AssignmentSerializer(assignments).data
        data["submission"] = AssignmentSubmissionSerializer(submission).data
        return Response(generateData("", False, data), status=status.HTTP_200_OK)
    

    def post(self, request, cid, aid):
        # rid = remark id 
     
        profile = Profile.objects.get(user__id = request.user.id)
        course = Course.objects.get(id = cid)

    
        assignment = Assignment.objects.filter(id = aid, is_deleted=False).first()
        if assignment == None:
            return Response(generateData("Couldnt find the assignment", True), status=status.HTTP_404_NOT_FOUND)

        file = None
        if "file" in request.FILES:
            file = request.FILES["file"]

    
        if request.data["request_type"] == "report":
            submission, created = AssignmentSubmission.objects.update_or_create(assignment=assignment, student = profile, defaults={
                "file" : file,
                "report_submitted" : True
            })
        elif request.data["request_type"] == "code":
            submission, created = AssignmentSubmission.objects.update_or_create(assignment=assignment, student = profile, defaults={
                "code" : request.data["code"],
                "code_submitted" : True
            })
        
        try:
            remark = AssignmentRemark.objects.create(submission = submission, remark_by=course.owner, report_score = 0, compilation_score = 0, running_score = 10 , test_cases_score = 10 , final_cases_score = 0, is_final_remark = False)
        except:
            remark = AssignmentRemark.objects.filter(submission = submission, submission__assignment__id = aid).first()
            remark.report_score = 0
            remark.compilation_score = 10
            remark.running_score = 10
            remark.test_cases_score = 10
            remark.final_cases_score = 0
            remark.save()

            print("ERROR when creating remark")

        return Response(generateData("Assignment Submitted", False, AssignmentSubmissionSerializer(submission).data), status=status.HTTP_200_OK)

    
    


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
    
