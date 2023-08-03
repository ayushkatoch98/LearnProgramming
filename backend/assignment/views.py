from useAuth.models import Profile, Course, CourseDetail, Assignment, AssignmentSubmission, AssignmentCode, AssignmentRemark, AssignmentGroup
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework import generics, permissions
import hashlib
import time
import os
from django.core.files.base import ContentFile

from django.core.files.temp import NamedTemporaryFile

from django.core.files import File

from useAuth.custom_permission import isStudent, isTeacher, isInCourse, isCourseOwner
from useAuth.serializers import AssignmentSerializer, AssignmentCodeSerializer, AssignmentRemarkSerializer, AssignmentSubmissionSerializer
from useAuth.utility import generateData
from datetime import datetime

def getAssginments(request, cid, aid=None):
    assignments = []

    if aid == None:
        assignments = Assignment.objects.filter(course__id = cid, is_deleted=False) 
    else:
        assignments = Assignment.objects.filter(course__id = cid, id = aid, is_deleted=False)


    data = AssignmentSerializer(assignments, many=True).data


    return Response(generateData("", False, data), status=status.HTTP_200_OK)


class AssignmentViewStudent(APIView):

    permission_classes = [permissions.IsAuthenticated, isStudent|isTeacher, isInCourse]

    # get a particular course assignments 
    def get(self, request, cid, aid=None):
        return getAssginments(request, cid, aid)
 


class AssignmentViewTeacher(APIView):

    permission_classes = [permissions.IsAuthenticated, isTeacher, isCourseOwner]


    def _generateGroups(self, request, cid, assignment):
        members = CourseDetail.objects.filter(course__id = cid)

        for i in range(1, len(members)):
            AssignmentGroup.objects.create(assignment = assignment , student_one = members[i-1].student, student_two = members[i].student )



    def get(self, request, cid, aid=None):
        return getAssginments(request, cid, aid)


    def post(self, request, cid):

        course = Course.objects.get(id = cid)
 
        print("file is" ,request.FILES)
        image = request.FILES["file"]

        hasCode = False
        if request.data["has_code"] == 'true':
            hasCode = True
        
        is_group = False
        if request.data["is_group"] == 'true':
            is_group = True
        # DATE TIME 2023-06-27 23:12

        d = list(map(int, request.data["date"].split("-"))) 
        t = list(map(int, request.data["time"].split(":"))) 

        # YYYY , MM , DD HH MM
        deadline = datetime(d[0], d[1], d[2], t[0], t[1] )
        print("DATETIME is", deadline)


        # assignment, created = Assignment.objects.get_or_create(title=request.data["title"], group=assignmentGroup, defaults={"course": course, "file":image, "type": request.data["assignment_type"]})
        assignment, created = Assignment.objects.get_or_create(title=request.data["title"], course__id = cid, defaults={"course": course, "file":image, "is_group" : is_group, "type": request.data["assignment_type"], "has_code": hasCode, "deadline" : deadline})

        
        if not created:
            return Response(generateData("Assignment already exists", True), status=status.HTTP_409_CONFLICT)
            
        
    
        try:
            assignmentCode = AssignmentCode.objects.create(
                title=request.data["code_title"], 
                description=request.data["code_description"],
                # test_cases=request.data["code_test_cases"],
                # final_cases=request.data["code_final_cases"],
                compilation_score=request.data["code_compilation_score"],
                running_score=request.data["code_running_score"],
                test_cases_score=request.data["code_test_cases_score"],
                final_cases_score=request.data["code_final_cases_score"],
                imports=request.data["imports_code"],
                solution_code=request.data["solution_code"],
                student_code=request.data["student_code"]
            )

            assignment.code = assignmentCode
            assignment.save()
            
            self._generateGroups(request, cid, assignment)

        except Exception as e: 
            assignment.delete()
            print("ERROR IS", e)
            return Response(generateData("Something went wrong", True), status=status.HTTP_400_BAD_REQUEST)
        

        return Response(generateData("Assignment Created", False, AssignmentSerializer(assignment).data), status=status.HTTP_200_OK)
    

    
    def put(self, request, cid):
        aid = request.data["aid"]

        is_published = False
        if request.data["is_published"] == "true":
            is_published = True


        is_group = False
        if request.data["is_group"] == 'true':
            is_group = True

        assignment = Assignment.objects.filter(id=aid).first()
        if assignment == None:
            return Response(generateData("Couldnt find the assignment", True), status=status.HTTP_404_NOT_FOUND)
            


        # DATE TIME 2023-06-27 23:12

        d = list(map(int, request.data["date"].split("-"))) 
        t = list(map(int, request.data["time"].split(":"))) 

        # YYYY , MM , DD HH MM
        deadline = datetime(d[0], d[1], d[2], t[0], t[1] )
        print("DATETIME is", deadline)

        
        hasCode = False
        if request.data["has_code"] == 'true':
            hasCode = True

        assignment.deadline = deadline
        if "file" in request.FILES and request.FILES["file"] != None:
            assignment.file = request.FILES["file"]
        assignment.title = request.data["title"]
        assignment.is_published = is_published
        assignment.type = request.data["assignment_type"]
        assignment.has_code = hasCode
        assignment.is_group = is_group
        assignment.save()


        assignmentCode = assignment.code

        assignmentCode.title=request.data["code_title"] 
        assignmentCode.description=request.data["code_description"]
        assignmentCode.compilation_score=request.data["code_compilation_score"]
        assignmentCode.running_score=request.data["code_running_score"]
        assignmentCode.test_cases_score=request.data["code_test_cases_score"]
        assignmentCode.final_cases_score=request.data["code_final_cases_score"]
        assignmentCode.imports=request.data["imports_code"]
        assignmentCode.solution_code=request.data["solution_code"]
        assignmentCode.student_code=request.data["student_code"]

        assignmentCode.save()
    
        return Response(generateData("Assignment Updated", False, AssignmentSerializer(assignment).data), status=status.HTTP_200_OK)

 
    def delete(self, request, cid):
        aid = request.data["aid"]
   
        obj = Assignment.objects.filter(id = aid, is_deleted=False).first()
        if obj == None:
            return Response(generateData("Couldnt find the Assignment", True), status=status.HTTP_404_NOT_FOUND)
        


        obj.is_deleted = True
        obj.title = "@deleted-" + str(time.time()) + "-" + obj.title
        obj.save()


        AssignmentRemark.objects.filter(submission__assignment = obj).delete()
        AssignmentSubmission.objects.filter(assignment = obj).delete()
        return Response(generateData("Assignment Deleted", False, AssignmentSerializer(obj).data), status=status.HTTP_200_OK)
            
  


class CodeRun(viewsets.ViewSet):

    permission_classes = [permissions.IsAuthenticated, isStudent, isInCourse]

    def post(self, request, cid, aid):

        # course = Course.objects.get(id = cid)
        # assignment = Assignment.objects.filter(id = aid).first()
        
        
        # if assignment == None:
        #     return Response(generateData("Couldnt find the Assignment"}, status=status.HTTP_404_NOT_FOUND)
        
        # assignmentCode = assignment.code
        
        # submission = AssignmentSubmission.objects.filter(student__user = request.user, assignment = assignment).first()
        
        # if submission == None:
        #     return Response(generateData("Couldnt find the Submission"}, status=status.HTTP_404_NOT_FOUND)
        
        # defaultCode = assignmentCode.code
        # studentCode = submission.code

        # f = NamedTemporaryFile(delete=True)
        # f.write(str.encode(studentCode + "\n\n" + defaultCode))

        # f.flush()
        # temp_file = File(f, name="code.py")

        # submission.file = temp_file
        # submission.save()``

        return Response({"err": False, "message" : "Running code", "data" : {"url" : "submission.file.url"}}, status=status.HTTP_200_OK)

        

