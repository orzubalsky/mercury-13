from django.forms import *
from videos.models import *
from django.contrib.admin.widgets import AdminDateWidget

class VideoForm (ModelForm):
    class Meta: 
        model = Video
        fields = ['author', 'message']
    
    page_number = forms.ModelChoiceField(queryset=Page.objects.all(), widget=forms.HiddenInput, error_messages={'required': 'please select a page'})
    filename    = forms.CharField(widget=forms.HiddenInput, error_messages={'required': 'Please upload a video file'})