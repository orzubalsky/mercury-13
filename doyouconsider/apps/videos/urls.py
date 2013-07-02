from django.conf.urls import patterns, include, url

urlpatterns = patterns('',
    url(r'start$', 'videos.views.start', name="start"),
    url(r'ajax-upload$', 'videos.views.import_uploader', name="my-ajax-upload"),
    url(r'^$', 'videos.views.index'),
    url(r'^(?P<video_id>\d+)/next/$', 'videos.views.next'),                      
    url(r'^(?P<video_id>\d+)/$', 'videos.views.detail'),    
    url(r'^add/$', 'videos.views.add'),  
)
