# Generated by Django 4.2.2 on 2023-06-29 23:09

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('useAuth', '0018_assignmentsubmission_status'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='assignmentremark',
            unique_together=set(),
        ),
        migrations.RemoveField(
            model_name='assignmentcode',
            name='compilation_score',
        ),
        migrations.RemoveField(
            model_name='assignmentcode',
            name='final_cases_score',
        ),
        migrations.RemoveField(
            model_name='assignmentcode',
            name='running_score',
        ),
        migrations.RemoveField(
            model_name='assignmentcode',
            name='test_cases_score',
        ),
        migrations.RemoveField(
            model_name='module',
            name='course',
        ),
        migrations.AlterField(
            model_name='assignmentremark',
            name='assignment_submission',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='useAuth.assignmentsubmission', unique=True),
        ),
        migrations.AlterField(
            model_name='assignmentremark',
            name='remark_by',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='useAuth.profile'),
        ),
        migrations.AlterUniqueTogether(
            name='course',
            unique_together={('owner', 'title', 'is_deleted')},
        ),
        migrations.RemoveField(
            model_name='assignmentremark',
            name='assignment',
        ),
        migrations.RemoveField(
            model_name='assignmentremark',
            name='student',
        ),
    ]
