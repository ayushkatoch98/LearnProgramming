# Generated by Django 4.2.2 on 2023-06-30 02:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('useAuth', '0020_assignmentsubmission_graded'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='assignmentsubmission',
            name='status',
        ),
        migrations.AddField(
            model_name='assignmentsubmission',
            name='code_submitted',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='assignmentsubmission',
            name='report_submitted',
            field=models.BooleanField(default=False),
        ),
    ]