# Generated by Django 5.0.6 on 2024-07-28 01:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('comments', '0004_notification'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='game_url',
            field=models.CharField(blank=True, max_length=255),
        ),
    ]
