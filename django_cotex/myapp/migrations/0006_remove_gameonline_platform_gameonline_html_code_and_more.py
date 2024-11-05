# Generated by Django 5.0.6 on 2024-11-01 12:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0005_gameonline'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='gameonline',
            name='platform',
        ),
        migrations.AddField(
            model_name='gameonline',
            name='html_code',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='gameonline',
            name='image_path',
            field=models.CharField(max_length=500, null=True),
        ),
    ]