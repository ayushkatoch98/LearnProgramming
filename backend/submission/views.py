from django.shortcuts import render
from useAuth.models import Module, ModuleGroup, Profile, Course, AssignmentRemark, CourseDetail, AssignmentSubmission, Assignment, AssignmentGroup
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework import generics, permissions
import hashlib
from pyflakes import api
import time
import py_compile
from py_compile import PyCompileError
from useAuth.custom_permission import isTeacher, isStudent, isCourseOwner, isInCourse
from useAuth.utility import generateData
from useAuth.serializers import ModuleGroupSerializer, AssignmentSubmissionSerializer, AssignmentSerializer
import subprocess
import tempfile
from subprocess import STDOUT, CalledProcessError
from datetime import datetime
import time
import sys



# Create your views here.

class CodeRunner():

    def run(code):

        f = tempfile.NamedTemporaryFile("w", dir="media/temp_files/" , suffix=".py", delete=False)
        f.write(code)
        f.close()
        
        a = None

        try:

            scores = {
                "compile": False,
                "running": False,
                "cases": False
            }

            try:
                py_compile.compile(f.name, doraise=True)
                scores["compile"] = True
            except PyCompileError as err:
                scores["compile"] = False
                print("err", err)
                return True, str(err), scores

            a = subprocess.check_output(["python3", f.name], stderr=STDOUT, shell=False)
            print("OUTPUT", a.decode())
            # TODO: remove the tempfile 
            # subprocess.run(["rm" , f.name])
            scores["running"] = True
            scores["cases"] = True
        except CalledProcessError as err:
            print("ERROR", err.output, err.returncode)
            if err.returncode == 3:
                # program ran successfully but test cases failed
                scores["running"] = True
                scores["cases"] = False    
                return True, err.output, scores
            
            scores["running"] = False
            scores["cases"] = False

            
            # error, and sending the error message 
            return True, err.output, scores
        
        # no error, sending the output
        return False, "\n" + a.decode(), scores
        

def getGroup(request, assignment, profile):
    
    g = AssignmentGroup.objects.filter(assignment=assignment, student_one = profile) | AssignmentGroup.objects.filter(assignment=assignment, student_two = profile)
    g = g.first()
    if g == None:
        return {}
    data = {
        "student_one" : g.student_one.user.first_name + " " + g.student_one.user.last_name,
        "student_two" : g.student_two.user.first_name + " " + g.student_two.user.last_name
    }
    

    return data



class SubmissionViewStudent(APIView):
    permission_classes = [permissions.IsAuthenticated, isStudent|isTeacher, isInCourse]

    def get(self, request, cid, aid):
        print("HMMM")
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
        data["group"] = getGroup(request, assignments, profile)
        return Response(generateData("", False, data), status=status.HTTP_200_OK)
    

    def post(self, request, cid, aid):
        # rid = remark id 
     
        profile = Profile.objects.get(user__id = request.user.id)
        course = Course.objects.get(id = cid)
        profile2 = None
    
        assignment = Assignment.objects.filter(id = aid, is_deleted=False).first()
        if assignment == None:
            return Response(generateData("Couldnt find the assignment", True), status=status.HTTP_404_NOT_FOUND)

        if assignment.is_group:
            result = AssignmentGroup.objects.filter(assignment=assignment, student_one = profile) | AssignmentGroup.objects.filter(assignment=assignment, student_two = profile)
            result = result.first()

            if result.student_one == profile:
                profile2 = result.student_two
            else:
                profile2 = result.student_one   


        file = None
        if "file" in request.FILES:
            file = request.FILES["file"]

        deadline = assignment.deadline.timestamp()
        today = datetime.now().timestamp()

        deadlineMet = True
        if today > deadline:
            deadlineMet = False

    
        if request.data["request_type"] == "report":
            submission, created = AssignmentSubmission.objects.update_or_create(assignment=assignment, student = profile, defaults={
                "file" : file,
                "report_submitted" : True,
                "deadline_met": deadlineMet
            })
        elif request.data["request_type"] == "code":
            
            submission, created = AssignmentSubmission.objects.update_or_create(assignment=assignment, student = profile, defaults={
                "code" : request.data["code"],
                "code_submitted" : True,
                "deadline_met": deadlineMet
            })

            if assignment.is_group:
                submission2, created = AssignmentSubmission.objects.update_or_create(assignment=assignment, student = profile2, defaults={
                    "code" : request.data["code"],
                    "code_submitted" : True,
                    "deadline_met": deadlineMet
                })
        
        scores = {
            "compile" : 0,
            "running" : 0,
            "test_cases_score": 0,
            "final_cases_score": 0
        }
        #TODO: RUN CODE RUNNER HERE 
        ENTIRE_CODE = "NOTHING"
        err = False
        output = ""
        if request.data["request_type"] == "code" and request.data["run_code"] == "true": 
            ENTIRE_CODE = request.data["code"].strip() + "\n\n\n" + assignment.code.solution_code
            print("ENTIRE CODE", ENTIRE_CODE)
            err , output, scores = CodeRunner.run(ENTIRE_CODE)

            print("SCORES" , scores)

            if scores["compile"]:
                scores["compile"] = assignment.code.compilation_score
            else:
                scores["compile"] = 0

            if scores["running"]:
                scores["running"] = assignment.code.running_score
            else:
                scores["running"] = 0

            if scores["cases"]:
                scores["test_cases_score"] = assignment.code.test_cases_score
                scores["final_cases_score"] = assignment.code.final_cases_score
            else:
                scores["test_cases_score"] = 0
                scores["final_cases_score"] = 0


        try:
            remark = AssignmentRemark.objects.create(submission = submission, remark_by=course.owner, report_score = 0, 
                                                    compilation_score = scores["compile"],
                                                    running_score = scores["running"],
                                                    test_cases_score = scores["test_cases_score"],
                                                    final_cases_score = scores["final_cases_score"],
                                                    is_final_remark = False)
            
            if assignment.is_group:
                remark = AssignmentRemark.objects.create(submission = submission2, remark_by=course.owner, report_score = 0, 
                                                    compilation_score = scores["compile"],
                                                    running_score = scores["running"],
                                                    test_cases_score = scores["test_cases_score"],
                                                    final_cases_score = scores["final_cases_score"],
                                                    is_final_remark = False)
        except:
            remark = AssignmentRemark.objects.filter(submission = submission, submission__assignment__id = aid).first()
            if request.data["request_type"] == "report":
                remark.report_score = 0
            else:
                remark.compilation_score = scores["compile"]
                remark.running_score = scores["running"]
                remark.test_cases_score = scores["test_cases_score"]
                remark.final_cases_score = scores["final_cases_score"]

            remark.save()

            if assignment.is_group:
                remark = AssignmentRemark.objects.filter(submission = submission2, submission__assignment__id = aid).first()
                if request.data["request_type"] == "report":
                    remark.report_score = 0
                else:
                    remark.compilation_score = scores["compile"]
                    remark.running_score = scores["running"]
                    remark.test_cases_score = scores["test_cases_score"]
                    remark.final_cases_score = scores["final_cases_score"]

                remark.save()
            
        data = {
            "ENTIRE_CODE" : ENTIRE_CODE,
            "codeError": err,
            "codeOutput" : output,
            "submission" : AssignmentSubmissionSerializer(submission).data,
            "scores": scores
        }
        return Response(generateData("Assignment Submitted", False, data), status=status.HTTP_200_OK)

    
    


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
    
