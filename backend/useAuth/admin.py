from django.contrib import admin
from .models import Course, CourseDetail, Module, Profile, ModuleGroup, Assignment, AssignmentCode, AssignmentRemark,AssignmentSubmission
# Register your models here.
admin.site.register(Course)
admin.site.register(CourseDetail)
admin.site.register(Module)
admin.site.register(Profile)
admin.site.register(ModuleGroup)
admin.site.register(Assignment)
admin.site.register(AssignmentCode)
admin.site.register(AssignmentRemark)
# admin.site.register(AssignmentGroup)
admin.site.register(AssignmentSubmission)