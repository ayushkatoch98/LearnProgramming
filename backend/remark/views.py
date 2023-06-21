from useAuth.models import Profile, Course, CourseDetail, Assignment, AssignmentGroup, AssignmentSubmission, AssignmentCode, AssignmentRemark
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework import generics, permissions
import hashlib
import time
from useAuth.custom_permission import isStudent, isTeacher, isInCourse, isCourseOwner


class RemarkViewStudent(viewsets.ViewSet):

    permission_classes = [permissions.IsAuthenticated, isStudent, isInCourse]

    def get(self, request, cid, aid):

        profile = Profile.objects.get(user__id = request.user.id)
        remarks = AssignmentRemark.objects.filter(student=profile, is_final_remark=True, assignment__id = aid)

        data = []
        for remark in remarks:
            data.append({
                "id" : remark.id,
                "title" : remark.assignment.title,
                "course_title": remark.assignment.course.title,
                "course_image" : remark.assignment.course.image.url,
                "course_owner": remark.assignment.course.owner.user.first_name,
                "course__id": remark.assignment.course.id,
                "report_score" : remark.report_score,
                "compilation_score" : remark.compilation_score,
                "running_score" : remark.running_score,
                "test_cases_score" : remark.test_cases_score,
                "final_cases_score" : remark.final_cases_score,
            })

        return Response(data, status=status.HTTP_200_OK)
    

class AssignmentViewTeacher(viewsets.ViewSet):

    permission_classes = [permissions.IsAuthenticated, isTeacher, isCourseOwner]


    def retrieveSubmissions(self, request, cid):

 
        submissions = AssignmentSubmission.objects.filter(course__id = cid, assignment__group__is_deleted=False)

        data = []

        for submission in submissions:
            data.append({
                "id" : submission.id,
                "title" : submission.assignment.title,
                "download" : submission.file.url,   
            })

        return Response(data, status=status.HTTP_200_OK)   
    
    def retrieveRemark(self, request, aid, cid, sid):
        # sid = submission id 

        profile = Profile.objects.get(user__id = request.user.id)
        assignment = Assignment.objects.filter(id = aid) 
        unique_together = [['assignment_submission', 'assignment', 'remark_by']]
        remark = AssignmentRemark.objects.filter(assignment_submission__id = sid, assignment__id = aid , is_final_remark=True).first()

        data = {
            "remark_by" : profile,
            "report_score": remark.report_score,
            "compilation_score" : remark.compilation_score,
            "running_score" : remark.running_score,
            "test_cases_score" : remark.test_cases_score,
            "final_cases_score" : remark.final_cases_score,
            "is_final_remark" : remark.is_final_remark,
        }

        return Response(data, status=status.HTTP_200_OK)
    
    # uid is user id 
    def post(self, request, cid, uid, aid):

        course = Course.objects.filter(id = cid).first()
        studentProfile = Profile.objects.get(user__id = uid)
        profile = Profile.objects.get(user__id = request.user.id)
        assignment = Assignment.objects.filter(id = aid) 
        submission = AssignmentSubmission.objects.filter(course__id = cid, assignment__group__is_deleted=False)

        if assignment == None:
            return Response({"err": True, "message": "Assignment doesnt exists"}, status=status.HTTP_409_CONFLICT)

        is_final_remark = False
        if request.data["is_final_remark"] == "true":
            is_final_remark = True

        remark, created = AssignmentRemark.objects.update_or_create(assignment=assignment, student=studentProfile, defaults={
            "assignment_submission": submission,
            "remark_by" : profile,
            "report_score": request.data["report_score"],
            "compilation_score" : request.data["compilation_score"],
            "running_score" : request.data["running_score"],
            "test_cases_score" : request.data["test_cases_score"],
            "final_cases_score" : request.data["final_cases_score"],
            "is_final_remark" : is_final_remark,
        })

        if not created:
            return Response({"err": True, "message": "Remark updated"}, status=status.HTTP_409_CONFLICT)

        return Response({"err": False, "message" : "Remark created"}, status=status.HTTP_200_OK)
    