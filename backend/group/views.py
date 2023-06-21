from django.shortcuts import render
from useAuth.models import Module, ModuleGroup, Profile, Course, CourseDetail
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework import generics, permissions
import hashlib
import time
from useAuth.custom_permission import isTeacher, isStudent, isCourseOwner, isInCourse


# Create your views here.

class GroupView(APIView):

    def get(self, request, cid):

        groups = ModuleGroup.objects.filter(course__id = cid)
        data = []

        for group in groups:
            data.append({
                "id" : group.id,
                "title": group.title
            })
            
        return Response({"err": False, "data": data, "message" : "module group created"}, status=status.HTTP_200_OK)
    
    def post(self, request, cid):

        course = Course.objects.filter(id = cid).first()
        module, created = ModuleGroup.objects.get_or_create(title = request.data["title"], course = course)
        data = {
            "id" : module.id,
            "title": module.title
        }
        if not created:
            return Response({"err": True, "message": "Group already exists"}, status=status.HTTP_409_CONFLICT)
        return Response({"err": False, "data": data, "message" : "module group created"}, status=status.HTTP_200_OK)
    
    def put(self, request, cid):

        # gid = id
        gid = request.data["gid"]

        is_published = False
        if request.data["is_published"] == "true":
            is_published = True

        group = ModuleGroup.objects.filter(id=gid).first()
        if group == None:
            return Response({"err": True, "message": "Couldnt find the group"}, status=status.HTTP_404_NOT_FOUND)
        
        group.title = request.data["title"]
        group.is_published = is_published
        group.save()

        data = {
            "title" : group.title,
            "id": group.id
        }
        
        return Response({"err": False, "data": data, "message" : "Module group updated"}, status=status.HTTP_200_OK)
    
    def delete(self, request, cid):
        gid = request.data["gid"]
      
        obj = ModuleGroup.objects.filter(id = gid, is_deleted=False).first()
        if obj == None:
            return Response({"err": True, "message": "Couldnt find the group"}, status=status.HTTP_404_NOT_FOUND)

        obj.is_deleted = True
        obj.save()
        return Response({"err": False, "message" : "group deleted"}, status=status.HTTP_200_OK)
            