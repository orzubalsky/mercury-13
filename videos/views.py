from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
from django.http import HttpResponseRedirect, HttpResponse
from django.core.urlresolvers import reverse
from videos.forms import *
from django.forms.formsets import formset_factory
from videos.models import *
import urllib2, json
from jsonEncoder import qdct_as_kwargs
from response import JSONResponse

def index(request):
    
    # if there is no ajax call, return 
    if request.method == "POST":
        return JSONResponse(Video.objects.get(pk=request.POST['pk']))
    
    main_video = Video.objects.order_by('?')[0] 
    
    video_list = Video.objects.all().order_by('-created')
    
    for video in video_list:

        url = "http://vimeo.com/api/v2/video/40461403.json"

        #response = urllib.urlopen('http://vimeo.com/api/v2/video/40461403.json')        
        #content = response.read()        
        #data = simplejson.loads(content)
        
        #req = urllib2.Request("http://vimeo.com/api/v2/video/40461403.json", None, {'user-agent':'syncstream/vimeo'})        
        #opener = urllib2.build_opener()        
        #content = opener.open(req)
        #data = simplejson.load(content)
   
        #result = simplejson.loads(urllib2.urlopen(url))   
        #outputDump = simplejson.dumps(result)
        
        video.thumbnail_url = 'test'
    
    return render_to_response('videos/index.html', {'video_list': video_list, 'main_video': main_video}, context_instance=RequestContext(request))
        
        
def detail(request, video_id):
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
    