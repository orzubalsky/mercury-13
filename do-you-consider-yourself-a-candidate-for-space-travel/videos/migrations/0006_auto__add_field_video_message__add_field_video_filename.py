# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'Video.message'
        db.add_column('videos_video', 'message',
                      self.gf('django.db.models.fields.TextField')(null=True),
                      keep_default=False)

        # Adding field 'Video.filename'
        db.add_column('videos_video', 'filename',
                      self.gf('django.db.models.fields.files.FileField')(max_length=100, null=True, blank=True),
                      keep_default=False)

    def backwards(self, orm):
        # Deleting field 'Video.message'
        db.delete_column('videos_video', 'message')

        # Deleting field 'Video.filename'
        db.delete_column('videos_video', 'filename')

    models = {
        'videos.page': {
            'Meta': {'object_name': 'Page'},
            'created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'filename': ('django.db.models.fields.files.ImageField', [], {'max_length': '100'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'number': ('django.db.models.fields.IntegerField', [], {'default': '1', 'max_length': '3'}),
            'status': ('django.db.models.fields.SmallIntegerField', [], {'default': '1', 'max_length': '1'}),
            'updated': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'})
        },
        'videos.video': {
            'Meta': {'object_name': 'Video'},
            'author': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'code': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'filename': ('django.db.models.fields.files.FileField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'message': ('django.db.models.fields.TextField', [], {'null': 'True'}),
            'page': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['videos.Page']"}),
            'status': ('django.db.models.fields.SmallIntegerField', [], {'default': '1', 'max_length': '1'}),
            'thumbnail': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'updated': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'vimeo_status': ('django.db.models.fields.SmallIntegerField', [], {'default': '3', 'max_length': '1'})
        }
    }

    complete_apps = ['videos']