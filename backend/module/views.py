from useAuth.models import Module, ModuleGroup, Profile, Course, CourseDetail
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework import generics, permissions
import hashlib
from django.db.models import Count
from useAuth.serializers import ModuleSerializer, ModuleGroupSerializer
from useAuth.utility import generateData
import time
from useAuth.custom_permission import isTeacher, isStudent, isCourseOwner, isInCourse
from django.db import IntegrityError

class ModuleViewStudent(APIView):

    permission_classes = [permissions.IsAuthenticated, isStudent, isInCourse]
    # list of modules 
    def get(self, request, cid):
        
     
        modules = Module.objects.filter(group__course__id = cid, is_deleted=False)

        if len(modules) == 0:
            return Response(generateData("", False, []), status=status.HTTP_200_OK)
        return Response(generateData("", False, ModuleSerializer(modules, many=True).data), status=status.HTTP_200_OK)
    

class ModuleViewTeacher(APIView):

    permission_classes = [permissions.IsAuthenticated, isTeacher, isCourseOwner]


    def get(self, request, cid, mid = None):
        
        modules = []
        if mid == None:
            modules = Module.objects.filter(group__course__id = cid, is_deleted=False)
        else:
            modules = Module.objects.filter(group__course__id = cid, is_deleted=False, id = mid)

        if len(modules) == 0:
            return Response(generateData("", False, []), status=status.HTTP_200_OK)
        return Response(generateData("", False, ModuleSerializer(modules, many=True).data), status=status.HTTP_200_OK)
    

    def post(self, request, cid):

        # course = Course.objects.get(id = cid)
        moduleGroup = ModuleGroup.objects.filter(id=request.data["gid"], is_deleted=False).first()
        if moduleGroup == None:
            return Response(generateData("Group not found", True), status=status.HTTP_404_NOT_FOUND)

        image = request.FILES["file"]

        module, created = Module.objects.get_or_create(title=request.data["title"], group=moduleGroup, is_deleted=False, defaults={"file":image, "type": "PDF"}) # "course": course, 
        if not created:
            return Response(generateData("Module already exists", True), status=status.HTTP_409_CONFLICT)
        
        data = generateData("Module Created", False, ModuleSerializer(module).data)
        return Response(data, status=status.HTTP_200_OK)
    

    def put(self, request, cid):
        # mid = id
        
        mid = request.data["mid"]

        is_published = False
        if request.data["is_published"] == "true":
            is_published = True

        module = Module.objects.filter(id=mid).first()
        if module == None:
            return Response(generateData("Module not found", True), status=status.HTTP_404_NOT_FOUND)
        
        try:
            module.title = request.data["title"]
            module.is_published = is_published
            module.file = request.FILES["file"]
            module.type = request.data["module_type"]
            module.save()
        except IntegrityError as err:
            return Response(generateData("Module with same name already exists", True), status=status.HTTP_404_NOT_FOUND)



        data = generateData("Module Updated", False, ModuleSerializer(module).data)
        return Response(data, status=status.HTTP_200_OK)
    

    def delete(self, request, cid):
        mid = request.data["mid"]
   
        obj = Module.objects.filter(id = mid, is_deleted=False).first()
        if obj == None:
            return Response(generateData("Module not found", True), status=status.HTTP_404_NOT_FOUND)

        obj.is_deleted = True
        obj.title = "@deleted-" + str(time.time()) + "-" + obj.title
        obj.save()
        return Response(generateData("Module Deleted", False, ModuleSerializer(obj).data), status=status.HTTP_200_OK)
            
  