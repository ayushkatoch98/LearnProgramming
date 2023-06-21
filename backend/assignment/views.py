from useAuth.models import Profile, Course, CourseDetail, Assignment, AssignmentSubmission, AssignmentCode
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



class AssignmentViewStudent(APIView):

    permission_classes = [permissions.IsAuthenticated, isStudent, isInCourse]

    def get(self, request, cid):

        assignments = Assignment.objects.filter(course__id = cid, is_deleted=False) # group__is_deleted = False

        data = []
        for assignment in assignments:
            data.append({
                "id" : assignment.id,
                "title" : assignment.title,
                "download" : assignment.file.url,
                "course_title": assignment.course.title,
                "course_image" : assignment.course.image.url,
                "course_owner": assignment.course.owner.user.first_name,
                "course__id": assignment.course.id,
            })

        return Response(data, status=status.HTTP_200_OK)
    
    def post(self, request, cid):

        aid = request.data["aid"]

        profile = Profile.objects.get(user__id = request.user.id)
        
        assignment = Assignment.objects.filter(id = aid, is_deleted=False).first()
        if assignment == None:
            return Response({"err": True, "message": "Couldnt find the assignment"}, status=status.HTTP_404_NOT_FOUND)
        
        file = request.FILES["file"]
        if request.data["request_type"] == "report":
            submission, created = AssignmentSubmission.objects.update_or_create(assignment=assignment, student = profile, defaults={
                "file" : file,
            })
        elif request.deta["request_type"] == "code":
            submission, created = AssignmentSubmission.objects.update_or_create(assignment=assignment, student = profile, defaults={
                "code" : request.data["code"]
            })
        
        return Response({"err": True, "message": "Assignment Submitted"}, status=status.HTTP_200_OK)

    

class AssignmentViewTeacher(APIView):

    permission_classes = [permissions.IsAuthenticated, isTeacher, isCourseOwner]


    def get(self, request, cid):

        assignments = Assignment.objects.filter(course__id = cid, is_deleted=False) 

        data = []
        for assignment in assignments:
            data.append({
                "id" : assignment.id,
                # "group": assignment.group.title,
                # "group_id": assignment.group.id,
                "title" : assignment.title,
                "download" : assignment.file.url,   
                "course_title": assignment.course.title,
                "course_image" : assignment.course.image.url,
                "course_owner": assignment.course.owner.user.first_name,
            })

        return Response(data, status=status.HTTP_200_OK)
    


    def post(self, request, cid):

        course = Course.objects.filter(id = cid).first()
        # assignmentGroup = AssignmentGroup.objects.filter(course__id=cid, id=request.data["gid"], is_deleted=False).first()
        # if assignmentGroup == None:
        #     return Response({"err": True, "message": "Couldnt find the group"}, status=status.HTTP_404_NOT_FOUND)

        print("file is" ,request.FILES)
        image = request.FILES["file"]

        # assignment, created = Assignment.objects.get_or_create(title=request.data["title"], group=assignmentGroup, defaults={"course": course, "file":image, "type": request.data["assignment_type"]})
        assignment, created = Assignment.objects.get_or_create(title=request.data["title"], defaults={"course": course, "file":image, "type": request.data["assignment_type"]})
        if not created:
            return Response({"err": True, "message": "Assignment already exists"}, status=status.HTTP_409_CONFLICT)
        

        try:
            assignmentCode = AssignmentCode.objects.create(
                title=request.data["code_title"], 
                description=request.data["code_description"],
                # test_cases=request.data["code_test_cases"],
                # final_cases=request.data["code_final_cases"],
                compilation_score=request.data["code_compilation_score"],
                running_score=request.data["code_running_score"],
                imports=request.data["imports_code"],
                test_cases_score=request.data["code_test_cases_score"],
                final_cases_score=request.data["code_final_cases_score"],
                code=request.data["solution_code"],
                user_code=request.data["user_code"]
            )

            assignment.code = assignmentCode
            assignment.save()
        except Exception as e: 
            assignment.delete()
            print("ERROR IS", e)
            return Response({"err": True, "message": "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({"err": False, "message" : "Assignment created"}, status=status.HTTP_200_OK)
    

    
    def put(self, request, cid):
        aid = request.data["aid"]

        is_published = False
        if request.data["is_published"] == "true":
            is_published = True

        assignment = Assignment.objects.filter(id=aid).first()
        if assignment == None:
            return Response({"err": True, "message": "Couldnt find the assignment"}, status=status.HTTP_404_NOT_FOUND)
        
        assignment.title = request.data["title"]
        assignment.is_published = is_published
        assignment.file = request.FILES["file"]
        assignment.type = request.data["assignment_type"]
        assignment.save()


        assignmentCode = assignment.code

        assignmentCode.title=request.data["code_title"], 
        assignmentCode.description=request.data["code_description"],
        # assignmentCode.test_cases=request.data["code_test_cases"],
        # assignmentCode.final_cases=request.data["code_final_cases"],
        assignmentCode.compilation_score=request.data["code_compilation_score"],
        assignmentCode.running_score=request.data["code_running_score"],
        assignmentCode.test_cases_score=request.data["code_test_cases_score"],
        assignmentCode.final_cases_score=request.data["code_final_cases_score"],
        assignmentCode.imports=request.data["imports_code"],
        assignmentCode.code=request.data["solution_code"],
        assignmentCode.user_code=request.data["user_code"]

        assignmentCode.save()
    
        return Response({"err": False, "message" : "Assignment updated"}, status=status.HTTP_200_OK)

 
    def delete(self, request, cid):
        aid = request.data["aid"]
   
        obj = Assignment.objects.filter(id = aid, is_deleted=False).first()
        if obj == None:
            return Response({"err": True, "message": "Couldnt find the Assignment"}, status=status.HTTP_404_NOT_FOUND)

        obj.is_deleted = True
        obj.save()
        return Response({"err": False, "message" : "Assignment deleted"}, status=status.HTTP_200_OK)
            
  


class CodeRun(viewsets.ViewSet):

    permission_classes = [permissions.IsAuthenticated, isStudent, isInCourse]

    def post(self, request, cid, aid):

        course = Course.objects.get(id = cid)
        assignment = Assignment.objects.filter(id = aid).first()
        
        
        if assignment == None:
            return Response({"err": True, "message": "Couldnt find the Assignment"}, status=status.HTTP_404_NOT_FOUND)
        
        assignmentCode = assignment.code
        
        submission = AssignmentSubmission.objects.filter(student__user = request.user, assignment = assignment).first()
        
        if submission == None:
            return Response({"err": True, "message": "Couldnt find the Submission"}, status=status.HTTP_404_NOT_FOUND)
        
        defaultCode = assignmentCode.code
        studentCode = submission.code

        f = NamedTemporaryFile(delete=True)
        f.write(str.encode(studentCode + "\n\n" + defaultCode))

        f.flush()
        temp_file = File(f, name="code.py")

        submission.file = temp_file
        submission.save()

        return Response({"err": False, "message" : "Running code", "data" : {"url" : submission.file.url}}, status=status.HTTP_200_OK)

        

