from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from django.utils import timezone

class Profile(models.Model):
    class Meta:
        db_table ="Profile"
            
    class Roles(models.TextChoices):
            TEACHER = "TEACHER"
            STUDENT = "STUDENT"
            TA = "TA"


    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, default=None)
    image = models.ImageField(upload_to="profile_pictures/")
    gender = models.CharField(max_length=1, null=False, default='O')
    dob = models.DateField(null=True)
    created_on = models.DateTimeField(auto_now_add=True)
    group = models.CharField(max_length=20, choices=Roles.choices, default=Roles.STUDENT)


    @receiver(post_save, sender=User)
    def create_or_update_user_profile(sender, instance, created, **kwargs):
        if created:
            # user conditional statements to add more options 
            Profile.objects.create(user=instance)
        else:
            instance.profile.save()

    def __str__(self):
        return str(self.user) + " @ " + self.group

class Course(models.Model):

    owner = models.ForeignKey(Profile, on_delete=models.CASCADE)
    title = models.CharField(max_length=100, null=False)
    description = models.CharField(max_length=10000, default="Welcome to this module", blank=True, null=True)
    token = models.CharField(max_length=100, null=False, unique=True)
    image = models.ImageField(upload_to="courses/")
    is_deleted = models.BooleanField(default=False)
    created_on = models.DateTimeField(auto_now_add=True)
    class Meta:
        unique_together = (('owner', 'title'),)

    def __str__(self):
        return str(self.title)


class CourseDetail(models.Model):
    student = models.ForeignKey(Profile, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    has_left = models.BooleanField(default=False)
    created_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [['student', 'course']]
    
    def __str__(self):
        return str(self.student) + " @ " + str(self.course)


class ModuleGroup(models.Model):
    title = models.CharField(max_length=100, null=False)
    is_published = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False) 
    created_on = models.DateTimeField(auto_now_add=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    class Meta:
        unique_together = [['course', 'title']]
    
    def __str__(self):
        return self.title

# store module group files like videos, pdfs etc
class Module(models.Model):

    class ModuleType(models.TextChoices):
            VIDEO = "VIDEO"
            PPT = "PPT"

    title = models.CharField(max_length=100, null=False)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    group = models.ForeignKey(ModuleGroup, on_delete=models.CASCADE)
    is_published = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)
    created_on = models.DateTimeField(auto_now_add=True)
    file = models.FileField(upload_to="modules/")
    type = models.CharField(max_length=20, choices=ModuleType.choices, null=False)

    class Meta:
        unique_together = [['group', 'title']]
    
    def __str__(self):
        return self.title



class AssignmentCode(models.Model):
    title = models.CharField(max_length=100, null=True)
    description = models.CharField(max_length=90000, null=True)
    imports = models.CharField(max_length=90000)
    # final_cases = models.CharField(max_length=90000)
    compilation_score = models.IntegerField(null=False, default=10)
    running_score = models.IntegerField(null=False, default=10)
    test_cases_score = models.IntegerField(null=False, default=10)
    final_cases_score = models.IntegerField(null=False, default=10)
    code = models.CharField(max_length=90000, default="", null=True)
    user_code = models.CharField(max_length=90000, default="", null=True)

    


# class AssignmentGroup(models.Model):
#     title = models.CharField(max_length=100, null=False)
#     is_published = models.BooleanField(default=True)
#     is_deleted = models.BooleanField(default=False) 
#     created_on = models.DateTimeField(auto_now_add=True)
#     course = models.ForeignKey(Course, on_delete=models.CASCADE)

#     class Meta:
#         unique_together = [['course', 'title']]


class Assignment(models.Model):

    class AssignmentType(models.TextChoices):
            REPORT = "REPORT"
            PROGRAMMING = "PROGRAMMING"
            BOTH = "BOTH"

    title = models.CharField(max_length=100, null=False, unique=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    # group = models.ForeignKey(AssignmentGroup, on_delete=models.CASCADE)
    is_published = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)
    created_on = models.DateTimeField(auto_now_add=True)
    deadline = models.DateTimeField(null=True, default=None)  
    code = models.ForeignKey(AssignmentCode, on_delete=models.CASCADE, null=True, default=None)
    file = models.FileField(upload_to="assignment/")
    type = models.CharField(max_length=20, choices=AssignmentType.choices, null=False)
    is_remark_published = models.BooleanField(default=False)

    class Meta:
        unique_together = [['course', 'title']]



    def __str__(self):
        return self.title


 

class AssignmentSubmission(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE)
    student = models.ForeignKey(Profile, on_delete=models.CASCADE)
    created_on = models.DateTimeField(auto_now=True)
    file = models.FileField(upload_to='assignment_submissions/', null=True, default="")
    code = models.CharField(max_length=90000, default="", null=True)
    late_submission = models.BooleanField(default=False)
    plag = models.FloatField(default=0, null=False)


    class Meta:
        unique_together = [['assignment', 'student']]

class AssignmentRemark(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE)
    assignment_submission = models.ForeignKey(AssignmentSubmission, on_delete=models.CASCADE)
    student = models.ForeignKey(Profile, on_delete=models.CASCADE)
    # remark_by = models.ForeignKey(Profile, on_delete=models.CASCADE)
    remark_by = models.CharField(max_length=50)
    report_score = models.IntegerField(default=0)
    compilation_score = models.IntegerField(null=False, default=10)
    running_score = models.IntegerField(null=False, default=10)
    test_cases_score = models.IntegerField(null=False, default=10)
    final_cases_score = models.IntegerField(null=False, default=10)
    is_final_remark = models.BooleanField(default=True)

    class Meta:
        unique_together = [['assignment_submission', 'assignment']]

class NotificationDetail(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    read = models.BooleanField(default=False)
    created_on = models.DateTimeField(auto_now=True)

class Notification(models.Model):
    title = models.CharField(max_length=2500, null=False)
    description = models.CharField(max_length=50, null=False)
    created_on = models.DateTimeField(auto_now=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    detail = models.ForeignKey(NotificationDetail, on_delete=models.CASCADE)


