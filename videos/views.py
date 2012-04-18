from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
from django.http import HttpResponseRedirect, HttpResponse
from django.core.urlresolvers import reverse
from videos.forms import *
from django.forms.formsets import formset_factory
from videos.models import *
import urllib2, json
from django.core import serializers
from django.utils import simplejson as json


def index(request):
    main_video = Video.objects.order_by('?')[0] 
    video_list = Video.objects.all().order_by('-created')
    
    # fetch thumbnails -- TODO: this should happen when the video is uploaded
    for video in video_list:
        response = urllib2.urlopen('http://vimeo.com/api/v2/video/%s.json' % (video.code))        
        data = json.loads(response.read(), encoding='utf-8')
        video.thumbnail_url = data[0][u'thumbnail_small']
    
    return render_to_response('videos/index.html', {'video_list': video_list, 'main_video': main_video}, context_instance=RequestContext(request))
        
        
def detail(request, video_id):
    # if there this url was called via ajax, return the video in json
    if request.method == "POST":
        data = serializers.serialize('json', Video.objects.filter(pk=video_id))
        return HttpResponse(data, mimetype='application/json')
            
    # fallback on view template
    video = get_object_or_404(Video, pk=video_id)
    return render_to_response('videos/detail.html', {'video': video})
    
    
def add(request):
    page = Page.objects.order_by('?')[0]    
    
    if request.method == 'POST':
        form = VideoForm(request.POST, request.FILES)
        if form.is_valid():
            validForm = form.save(commit=False)
            validForm.page_id = page.id;
            validForm.save()   
            return HttpResponseRedirect('/videos/')                   
    else :
        form = VideoForm()
    
    return render_to_response('videos/add.html', {'page': page, 'form': form}, context_instance=RequestContext(request))
    