# Generated by Django 4.2.2 on 2023-06-30 03:29

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('useAuth', '0021_remove_assignmentsubmission_status_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='assignmentremark',
            old_name='assignment_submission',
            new_name='submission',
        ),
    ]
