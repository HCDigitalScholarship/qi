# Generated by Django 2.0.6 on 2018-07-19 15:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('QI', '0034_auto_20180628_1922'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='pendingtranscription',
            name='doc',
        ),
        migrations.DeleteModel(
            name='PendingTranscription',
        ),
    ]
