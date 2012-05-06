from videos.models import *
from django.contrib import admin

class VideosInline(admin.TabularInline):
    model = Video
    extra = 2
    fields = ['page', 'code', 'author']

class VideoAdmin(admin.ModelAdmin):
    fields = ['status', 'page', 'code', 'author']

class PageAdmin(admin.ModelAdmin):
    inlines = [VideosInline]
    list_display = ('number', 'videos')

admin.site.register(Page, PageAdmin)
admin.site.register(Video, VideoAdmin)
