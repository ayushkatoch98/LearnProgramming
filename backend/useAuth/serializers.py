from .models import Course, CourseDetail, Module, ModuleGroup, Assignment, AssignmentCode, AssignmentRemark, AssignmentSubmission, Profile
from rest_framework import serializers


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'
        depth = 2

class CourseDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseDetail
        fields = '__all__'
        depth = 2

class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = '__all__'
        depth = 2

class ModuleGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModuleGroup
        fields = '__all__'
        depth = 2

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'
        depth = 2

class AssignmentRemarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignmentRemark
        fields = '__all__'
        depth = 2

class AssignmentSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignmentSubmission
        fields = '__all__'
        depth = 2


class AssignmentCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignmentCode
        fields = '__all__'
        depth = 2

class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = '__all__'
        depth = 2