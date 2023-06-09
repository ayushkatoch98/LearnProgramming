# Generated by Django 4.2.2 on 2023-06-27 21:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('useAuth', '0016_alter_assignment_unique_together'),
    ]

    operations = [
        migrations.RenameField(
            model_name='assignmentcode',
            old_name='code',
            new_name='solution_code',
        ),
        migrations.RenameField(
            model_name='assignmentcode',
            old_name='user_code',
            new_name='student_code',
        ),
        migrations.AlterUniqueTogether(
            name='assignment',
            unique_together={('course', 'title', 'is_deleted')},
        ),
        migrations.AlterUniqueTogether(
            name='module',
            unique_together={('group', 'title', 'is_deleted')},
        ),
        migrations.AddField(
            model_name='assignment',
            name='has_code',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='assignmentsubmission',
            name='file',
            field=models.FileField(default='', null=True, upload_to='assignment_submissions/'),
        ),
        migrations.AlterField(
            model_name='module',
            name='type',
            field=models.CharField(choices=[('VIDEO', 'Video'), ('PPT', 'Ppt')], default='PPT', max_length=20),
        ),
        migrations.AlterUniqueTogether(
            name='modulegroup',
            unique_together={('course', 'title', 'is_deleted')},
        ),
    ]
