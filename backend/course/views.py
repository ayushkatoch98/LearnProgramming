# from ..useAuth.models import Course, CourseDetail
from useAuth.models import Course, CourseDetail, Profile
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework import generics, permissions
import hashlib
import time
from useAuth.custom_permission import isStudent, isTeacher  

class CourseViewStudent(APIView):
    permission_classes = [permissions.IsAuthenticated, isStudent|isTeacher]

    def get(self, request, id=None):

        profile = Profile.objects.get(user = request.user)
        data = None

        courses = []
        if id == None:
            courses = CourseDetail.objects.filter(student = profile)
        else:
            courses = CourseDetail.objects.filter(course__id = id, student__user = request.user )

        data = list(courses.values("course__id", "course__title", "course__image", "course__owner__user__first_name"))

        return Response(data, status=status.HTTP_200_OK)
        
    
    # to join a course
    def post(self, request):
        profile = Profile.objects.get(user = request.user)
        
        course = Course.objects.filter(token = request.data["token"], is_deleted=False).first()
        
        if course == None:
            return Response({"err" : True, "message": "Invalid Token"}, status=status.HTTP_404_NOT_FOUND)
        
        
        obj, created = CourseDetail.objects.get_or_create(student=profile, course=course)
        if created == False or obj.has_left == False:
            return Response({"err" : False, "message": "Already a member of this course"}, status=status.HTTP_302_FOUND)
        
        
        obj.has_left = False
        obj.save()

        data = {
            "username": profile.user.username,
            "title": course.title,
            "joined" : True,
        }

        return Response(data, status=status.HTTP_200_OK)
    
    def delete(self, request, id=None):

        if id == None:
            return Response({"err": True, "message": "No couse id provided"}, status=status.HTTP_400_BAD_REQUEST)

        profile = Profile.objects.get(user = request.user)

        obj = CourseDetail.objects.filter(course__id = id, student=profile, has_left=False).first()
        if obj == None:
            return Response({"err" : True, "message": "Not in this course"}, status=status.HTTP_404_NOT_FOUND)
        
        obj.has_left = True
        obj.save()

        return Response({"err": False, "message": "Left Course"}, status=status.HTTP_200_OK)



class CourseViewTeacher(APIView):
    permission_classes = [permissions.IsAuthenticated, isTeacher]

 
    def get(self, request, id=None):
            
        courses = []
        if id == None:
            courses = Course.objects.filter(owner__user = request.user, is_deleted=False)
        else:
            courses = Course.objects.filter(owner__user = request.user, is_deleted=False, id = id)

        data = []
        for course in courses:
            image = course.image
            if course.image == None or course.image == "":
                image = ""
            else:
                image = course.image.url
            data.append({
                "id": course.id,
                "title" : course.title,
                "description" : course.description,
                "image" : image,
                "token": course.token,
            })

            
        
        return Response(data, status=status.HTTP_200_OK)
    

    def post(self, request):
        profile = Profile.objects.get(user = request.user)

        toHash = request.user.username + " " + str(time.time())
        hash_object = hashlib.md5(toHash.encode())
        print("hash", hash_object.hexdigest())
        image = request.FILES["file"]
        course, created = Course.objects.get_or_create(title=request.data["title"], owner=profile, defaults={"image":image, "description": request.data["description"], "token":hash_object.hexdigest()})
        if not created:
            return Response({"err" : True, "message": "Course already exists"}, status.HTTP_409_CONFLICT)

        data = {
            "id" : course.id,
            "title": course.title,
            "image": course.image.url,
            "token": course.token
        }

        print("Data is", data, CourseDetail, profile, course)
        # joining course as teacher     
        try:
            obj = CourseDetail.objects.create(student=profile, course=course)
            if created == False and obj.has_left == True:
                return Response({"err" : False, "message": "Already a member of this course"}, status=status.HTTP_302_FOUND)
        except:
            course.delete()
            return Response({"err" : False, "message": "Something went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        
        obj.has_left = False
        obj.save()

        
        return Response(data, status=status.HTTP_200_OK)
    

    def put(self, request, id=None):

        obj = Course.objects.filter(id = id, owner__user = request.user, is_deleted=False).first()
        if obj == None: 
            return Response({"err" : True, "message": "Course not found"}, status.HTTP_404_NOT_FOUND)
        if "file" in request.FILES and request.FILES["file"] != None:
            obj.image=request.FILES["file"]

        print("FILE IS", request.FILES)

        obj.title=request.data["title"]
        obj.description=request.data["description"]
        
        try:
            obj.save()
        except:
            return Response( {"err" : False, "message" : "title already exists"}, status.HTTP_409_CONFLICT)

        return Response( {"err" : False, "message" : "updated"}, status.HTTP_200_OK)
    

    def delete(self, request, id=None):

        obj = Course.objects.filter(id = id, owner__user = request.user, is_deleted = False).first()
        if obj == None:
            return Response({"err" : True, "message": "No course found or it has already been deleted"}, status.HTTP_404_NOT_FOUND)
        
        obj.is_deleted = True
        obj.save()

        return Response({"err": False, "message": "Deleted"}, status.HTTP_200_OK)
