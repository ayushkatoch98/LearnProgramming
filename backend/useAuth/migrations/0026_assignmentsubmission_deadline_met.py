# Generated by Django 4.2.2 on 2023-07-04 12:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('useAuth', '0025_alter_assignmentremark_submission'),
    ]

    operations = [
        migrations.AddField(
            model_name='assignmentsubmission',
            name='deadline_met',
            field=models.BooleanField(default=True),
        ),
    ]