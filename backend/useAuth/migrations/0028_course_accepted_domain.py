# Generated by Django 4.2.2 on 2023-07-05 01:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('useAuth', '0027_alter_assignment_title'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='accepted_domain',
            field=models.CharField(default='@gmail.com', max_length=50),
        ),
    ]
