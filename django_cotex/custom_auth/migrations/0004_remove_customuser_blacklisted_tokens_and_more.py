# Generated by Django 5.0.6 on 2024-06-08 14:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('custom_auth', '0003_customblacklistedtoken'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customuser',
            name='blacklisted_tokens',
        ),
        migrations.DeleteModel(
            name='CustomBlacklistedToken',
        ),
    ]
