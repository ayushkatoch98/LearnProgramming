# Generated by Django 4.2.2 on 2023-06-13 18:48

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('useAuth', '0009_remove_assignment_url_remove_module_url_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='assignment',
            name='code',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='useAuth.assignmentcode'),
        ),
    ]
