# Generated by Django 4.2.2 on 2023-06-11 17:02

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('useAuth', '0006_alter_assignmentremark_unique_together_and_more'),
    ]

    operations = [
        migrations.AlterModelTable(
            name='assignmentcode',
            table='AssignmentCode',
        ),
        migrations.AlterModelTable(
            name='notification',
            table='Notification',
        ),
        migrations.AlterModelTable(
            name='notificationdetail',
            table='NotificationDetail',
        ),
    ]