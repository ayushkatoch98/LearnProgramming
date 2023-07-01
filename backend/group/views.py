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
from useAuth.utility import generateData
from useAuth.serializers import ModuleGroupSerializer

# Create your views here.

class GroupView(APIView):
    permission_classes = [permissions.IsAuthenticated, isTeacher, isCourseOwner]

    def get(self, request, cid):

        groups = ModuleGroup.objects.filter(course__id = cid)

        if len(groups) == 0:
            return Response(generateData("Group List", False, []), status=status.HTTP_200_OK)
        
        print("GRPIPS" , groups)
        return Response(generateData("Group List", False, ModuleGroupSerializer(groups, many=True).data), status=status.HTTP_200_OK)
    

    def _post_put(self, request, cid, performUpdate = False):

        gid = None
        if performUpdate:
            gid = request.data["gid"]

        course = Course.objects.get(id = cid)

        is_published = False
        if request.data["is_published"] == "true":
            is_published= True 

        moduleGroup, created = ModuleGroup.objects.update_or_create(id = gid, defaults={
            "title": request.data["title"],
            "course": course,
            "is_deleted": False,
            "is_published": is_published
        })
 
        if not created:
            return Response(generateData("Group updated", False, ModuleGroupSerializer(moduleGroup).data), status=status.HTTP_200_OK)
        return Response(generateData("Group Created`", False, ModuleGroupSerializer(moduleGroup).data), status=status.HTTP_200_OK)

    def post(self, request, cid):
        return self._post_put(request, cid)
  
    def put(self, request, cid):
        return self._post_put(request, cid, True)

    def delete(self, request, cid):
        gid = request.data["gid"]
      
        obj = ModuleGroup.objects.filter(id = gid, is_deleted=False).first()
        if obj == None:
            return Response({"err": True, "message": "Couldnt find the group"}, status=status.HTTP_404_NOT_FOUND)

        obj.is_deleted = True
        obj.title = "@deleted-" + str(time.time()) + "-" + obj.title
        obj.save()
        return Response({"err": False, "message" : "group deleted"}, status=status.HTTP_200_OK)
            