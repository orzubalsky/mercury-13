from django.forms import *
from videos.models import *
from django.contrib.admin.widgets import AdminDateWidget

class VideoForm (ModelForm):
    class Meta: 
        model = Video
        
