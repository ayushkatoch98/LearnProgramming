# Generated by Django 4.2.2 on 2023-06-19 03:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('useAuth', '0013_alter_assignment_unique_together_and_more'),
    ]

    operations = [
        migrations.DeleteModel(
            name='AssignmentGroup',
        ),
    ]
