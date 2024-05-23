# Generated by Django 5.0.6 on 2024-05-22 02:01

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('release_date', models.CharField(max_length=100)),
                ('cracker', models.CharField(max_length=100)),
                ('platform', models.CharField(max_length=100)),
                ('version', models.CharField(max_length=100)),
                ('genres', models.JSONField()),
                ('languages', models.JSONField()),
                ('format', models.CharField(max_length=100)),
                ('size', models.CharField(max_length=100)),
                ('youtube_link', models.URLField(max_length=500)),
                ('download_link', models.URLField(max_length=500)),
                ('image_url', models.URLField(max_length=500)),
            ],
        ),
    ]
