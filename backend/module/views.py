from useAuth.models import Module, ModuleGroup, Profile, Course, CourseDetail
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework import generics, permissions
import hashlib
from django.db.models import Count

import time
from useAuth.custom_permission import isTeacher, isStudent, isCourseOwner, isInCourse


class ModuleViewStudent(APIView):

    permission_classes = [permissions.IsAuthenticated, isStudent, isInCourse]

    def get(self, request, cid):

        modules = []

        modules = Module.objects.filter(course__id = cid, is_deleted=False, group__is_deleted = False)

        data = []
        for module in modules:
            data.append({
                "id" : module.id,
                "title" : module.title,
                "download" : module.file.url,
                "course_title": module.course.title,
                "course_image" : module.course.image.url,
                "course_owner": module.course.owner.user.first_name,
                "course__id": module.course.id,
                "course_group": module.group.title,
                "course_group_id": module.group.id
            })

        return Response(data, status=status.HTTP_200_OK)
    

class ModuleViewTeacher(APIView):

    permission_classes = [permissions.IsAuthenticated, isTeacher, isCourseOwner]


    def get(self, request, cid, mid = None):
        
        modules = []
        if mid == None:
            modules = Module.objects.filter(course__id = cid, is_deleted=False)
        else:
            modules = Module.objects.filter(course__id = cid, is_deleted=False, id = mid)

        print("AGG", modules)
        data = []
        for module in modules:
            data.append({
                "id" : module.id,
                "group": module.group.title,
                "gid": module.group.id,
                "title" : module.title,
                "download" : module.file.url,
                "course_title": module.course.title,
                "course_image" : module.course.image.url,
                "course_owner": module.course.owner.user.first_name,
            })

        return Response(data, status=status.HTTP_200_OK)
    


    def post(self, request, cid):

        course = Course.objects.filter(id = cid).first()
        moduleGroup = ModuleGroup.objects.filter(course__id=cid, id=request.data["gid"], is_deleted=False).first()
        if moduleGroup == None:
            return Response({"err": True, "message": "Couldnt find the group"}, status=status.HTTP_404_NOT_FOUND)

        print("file is" ,request.FILES)
        image = request.FILES["file"]

        module, created = Module.objects.get_or_create(title=request.data["title"], group=moduleGroup, defaults={"course": course, "file":image, "type": "PDF"})
        if not created:
            return Response({"err": True, "message": "Module already exists"}, status=status.HTTP_409_CONFLICT)
        
        return Response({"err": False, "message" : "Module created"}, status=status.HTTP_200_OK)
    

    def put(self, request, cid):
        # mid = id
        mid = request.data["mid"]

        is_published = False
        if request.data["is_published"] == "true":
            is_published = True

        module = Module.objects.filter(id=mid).first()
        if module == None:
            return Response({"err": True, "message": "Couldnt find the module"}, status=status.HTTP_404_NOT_FOUND)
        
        module.title = request.data["title"]
        module.is_published = is_published
        module.file = request.FILES["file"]
        module.type = request.data["module_type"]
        module.save()


        return Response({"err": False, "message" : "Module updated"}, status=status.HTTP_200_OK)
    

    def delete(self, request, cid):
        mid = request.data["mid"]
   
        obj = Module.objects.filter(id = mid, is_deleted=False).first()
        if obj == None:
            return Response({"err": True, "message": "Couldnt find the module"}, status=status.HTTP_404_NOT_FOUND)

        obj.is_deleted = True
        obj.save()
        return Response({"err": False, "message" : "module deleted"}, status=status.HTTP_200_OK)
            
  