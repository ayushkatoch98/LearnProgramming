# from ..useAuth.models import Course, CourseDetail
from useAuth.models import Course, CourseDetail, Profile, Module, ModuleGroup, Assignment, AssignmentCode
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

def generateUniqueToken(username):
    toHash = username + " " + str(time.time())
    hash_object = hashlib.md5(toHash.encode())
    print("hash", hash_object.hexdigest())  
    return hash_object.hexdigest()

def getCourse(cid, request):   
    return Course.objects.get(id = cid, owner__user = request.user, is_deleted = False)
    
        
class CourseViewStudent(APIView):
    permission_classes = [permissions.IsAuthenticated, isStudent|isTeacher]

    def get(self, request, cid=None):
        
        profile = Profile.objects.get(user = request.user)
        courses = []
        courseDetails = []
        if cid == None:
            courseDetails = CourseDetail.objects.filter(student = profile, request_accepted = True)
        else:
            courseDetails = CourseDetail.objects.filter(course__id = cid, request_accepted = True)

        for courseDetail in courseDetails:
            courses.append(courseDetail.course)

        return Response(generateData("", False, CourseSerializer(courses, many=True).data), status=status.HTTP_200_OK)

class CourseViewTeacher(APIView):
    permission_classes = [permissions.IsAuthenticated, isTeacher]

    def get(self, request, cid=None):
            
        courses = []
        if cid == None:
            courses = Course.objects.filter(owner__user = request.user, is_deleted=False)
        else:
            courses = Course.objects.filter(owner__user = request.user, is_deleted=False, id = cid)

        courses = CourseSerializer(courses, many=True)
        return Response(generateData("", False, courses.data), status=status.HTTP_200_OK)
    

    def post(self, request):
        profile = Profile.objects.get(user = request.user)
        print("WOW DATA" , request.data)
        token = generateUniqueToken(request.user.username)
        # image = request.FILES["file"]
        
        course = None
        try:
            image=request.FILES["file"]
            course = Course.objects.create(title=request.data["title"], owner=profile, image=image, description=request.data["description"], accepted_domain = request.data["accepted_domain"], token=token)
        except IntegrityError as err:
            print("error" , err)
            return Response(generateData("Course already exists" + str(err), True), status.HTTP_409_CONFLICT)


        # joining course as teacher     
        try:
            obj = CourseDetail.objects.create(student=profile, course=course)
        except IntegrityError as err:
            print("error", err)
            course.delete()
            return Response(generateData("Something went wrong" + str(err), True), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    
        return Response(generateData("Course Created", False, CourseSerializer(course).data), status=status.HTTP_200_OK)
    

    def put(self, request, cid):

    
        course = getCourse(cid, request)

        try:

            if "file" in request.FILES and request.FILES["file"] != None:
                course.image=request.FILES["file"]

            course.title=request.data["title"]
            course.description=request.data["description"]
            course.accepted_domain = request.data["accepted_domain"]
            
            course.save()
        except Exception as ex:
            print("ERR IS", ex)
            return Response( generateData("title already exists", True), status.HTTP_409_CONFLICT)

        return Response( generateData("Course Updated", False, CourseSerializer(course).data), status.HTTP_200_OK)
    

    def delete(self, request, cid):

        course = getCourse(cid, request)
        course.delete()
        # course.is_deleted = True
        # course.title = "@deleted-" + str(time.time()) + "-" + course.title
        # course.save()

        return Response(generateData("Course Deleted", False, CourseSerializer(course).data), status.HTTP_200_OK)


class CourseViewCopyTeacher(APIView):
    permission_classes = [permissions.IsAuthenticated, isTeacher, isCourseOwner]

    def post(self, request, cid):
        user = request.user
        profile = Profile.objects.get(user__id = user.id)
        
        token = generateUniqueToken(user.username)
        # copy course
        course = Course.objects.get(id = cid)
        print("OLD COURSE", course.id)
        course.title = course.title + " copy " + str(time.time())
        course.id = None
        course.token = token
        course.save()
        print("NEW COURSE", course.id)

        # add teacher as a student 
        courseDetails = CourseDetail.objects.create(student = profile, course=course)

        moduleGroups = ModuleGroup.objects.filter(course__id = cid)

        # copying moduleGroups and module
        for group in moduleGroups:
            modules = Module.objects.filter(group__id = group.id)

            group.id = None
            group.course = course
            group.save()
            # newGroup = ModuleGroup.objects.create(title = group.title, course = course, is_published = group.is_published, is_deleted = group.is_deleted)

            for module in modules:
                module.id = None
                module.group = group
                module.save()


        assignments = Assignment.objects.filter(course__id = cid)
        for assignment in assignments:
            code = AssignmentCode.objects.get(id = assignment.code.id)
            code.id = None
            code.save()

            assignment.id = None
            assignment.course = course
            assignment.code = code
            print("ASSIGNMENT", assignment.title, assignment.is_deleted, assignment.course.title)
            assignment.save()


        return Response(generateData("Course copied", False, CourseSerializer(course).data), status.HTTP_200_OK)
