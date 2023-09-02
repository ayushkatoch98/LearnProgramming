from django.shortcuts import redirect, render, HttpResponseRedirect
from .models import Profile
from .serializers import ProfileSerializer
from django.urls import reverse
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.hashers import make_password

# from .serializers import ProfileSerialzer, RegisterSerializer, UserSerializer, ChangePasswordSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from rest_framework.authtoken.serializers import AuthTokenSerializer
from django.contrib.auth import login
import logging
from django.core import serializers

from knox.views import LoginView as KnoxLoginView
# from rest_framework.authentication import SessionAuthentication

from useAuth.utility import generateData
from itertools import chain

def to_dict(instance):
    opts = instance._meta
    data = {}

    for f in chain(opts.concrete_fields, opts.private_fields):
        data[f.name] = f.value_from_object(instance)
    for f in opts.many_to_many:
        data[f.name] = [i.id for i in f.value_from_object(instance)]
    return data


class IsAuthenticated(APIView):
    # permission_classes = (permissions.IsAuthenticated)

    def get(self, request):
        if request.user.is_authenticated:
            return Response({}, status=status.HTTP_200_OK)
        
        return Response({}, status=status.HTTP_401_UNAUTHORIZED)
    
class LoginAPI(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        loggedIn = False
        message = "User not logged in"
        details = ""
        if request.user.is_authenticated:
            loggedIn = True
            message = "User is logged in"
            details = request.user.first_name + " " + request.user.last_name + " ID: " + str(request.user.id)

        data = {"err" : False, "message" : message, "data" : details , "loggedIn" : loggedIn}

        return Response(data, status=status.HTTP_200_OK)

    def post(self, request):
        print("DATA RECEVIED", request)

        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        
        # request.POST._mutable = True
        # request.data._mutable = True
        # request.data["username"] = request.data["email"]
        login(request, user)
        # request.POST._mutable = False
        # request.data._mutable = False

        print(serializer.data , user)
        a = super(LoginAPI, self).post(request, format=None)
        if a.status_code != status.HTTP_200_OK:
            return Response({"err": True, "message": "Invalid Credentials"}, status=status.HTTP_400_BAD_REQUEST)
        
        a = a.data
        
        user = User.objects.get(username = request.data["username"])
        profile = Profile.objects.get(user__id = user.id)
        image = ""
        print("IMAGe", profile.image)
        if profile.image != None and profile.image != "":
            image = profile.image.url
            
        returnData = {
            "id" : user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "username": user.username,
            "email": user.email,
            "group": profile.group,
            "image": image,
            "token": a["token"],
            "expiry": a["expiry"],
        }
        
        
        
        
        
        return Response(returnData , status=status.HTTP_200_OK)


class AccountView(APIView):

    def post(self, request):
        print("POST", request.data, request)

        obj = User.objects.filter(email = request.data["email"])
        if len(obj) != 0:
            return Response({"statis": "error", "message" : "User with the provided email already exists" , "data" : {"message" : ["User with the provided email already exists"] }}, status=status.HTTP_400_BAD_REQUEST)

        obj = User.objects.create(first_name=request.data["first_name"], last_name=request.data["last_name"], email=request.data["email"], password=make_password(request.data["password"]), username=request.data["email"])
        obj.save()

        js = to_dict(obj)
        # js = serializers.serialize("json", [obj,])

        return Response({"status": "success","message":"New Profile created successfully", "append":True}, status=status.HTTP_200_OK)

class ProfileView(APIView):
    
    def post(self, request, uid):

        profile = Profile.objects.get(user__id=uid)

        profile.user.first_name = request.data["first_name"]
        profile.user.last_name = request.data["last_name"]

        
        if "file" in request.FILES:
            file = request.FILES["file"]
            profile.image = file

        profile.save()

        data = ProfileSerializer(profile).data
        return Response(generateData("Profile Updated", False, data), status=status.HTTP_200_OK)
    