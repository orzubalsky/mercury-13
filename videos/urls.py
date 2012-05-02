from django.conf.urls import patterns, include, url

urlpatterns = patterns('',
    url(r'^$', 'videos.views.index'),
    url(r'^(?P<video_id>\d+)/next/$', 'videos.views.next'),                      
    url(r'^(?P<video_id>\d+)/$', 'videos.views.detail'),    
    url(r'^add/$', 'videos.views.add'),  
)
