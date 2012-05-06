from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
from django.http import HttpResponseRedirect, HttpResponse
from django.core.urlresolvers import reverse
from videos.forms import *
from django.forms.formsets import formset_factory
from videos.models import *
from django.core import serializers
from django.utils import simplejson as json


def index(request):   
    video = Video.objects.filter(page__number=1).order_by('?')[0]    
    video_list = Video.objects.all().order_by('page')
    
    return render_to_response('videos/index.html', {'video_list': video_list, 'video': video}, context_instance=RequestContext(request))
        
        
def detail(request, video_id):
    if request.method == "POST":
        data = serializers.serialize('json', Video.objects.filter(pk=video_id))
        return HttpResponse(data, mimetype='application/json')
            
    # fallback on view template
    video = get_object_or_404(Video, pk=video_id)
    return render_to_response('videos/detail.html', {'video': video})
    
    
def next(request, video_id):
    if request.method == "POST":
        current_video = get_object_or_404(Video, pk=video_id)
        if current_video.page.number == 86:
            next_page = 1
        else:
            next_page = current_video.page.number + 1;
        next_video = Video.objects.filter(page__number=next_page).order_by('?')[0]
        data = serializers.serialize('json', [next_video])
        return HttpResponse(data, mimetype='application/json')

    
def add(request):
    page = Page.objects.order_by('?')[0]
    pages = Page.objects.all
    
    if request.method == 'POST':
        form = VideoForm(request.POST, request.FILES)
        if form.is_valid():
            validForm = form.save(commit=False)
            validForm.page_id = page.id;
            validForm.save()   
            return HttpResponseRedirect('/videos/')                   
    else :
        form = VideoForm()
    
    return render_to_response('videos/add.html', {'pages': pages, 'form': form}, context_instance=RequestContext(request))
    