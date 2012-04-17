from django.db.models import *
import os,sys


class Base(Model):
    """
    Abstract base model class which other models are based on.
    Includes crud date meta data and active/inactive status
    """

    STATUS_CHOICES = (
        (0, 'Inactive'),
        (1, 'Active')
    )

    class Meta:
            abstract = True
                    
    created     = DateTimeField(auto_now_add=True, editable=False)
    updated     = DateTimeField(auto_now=True, editable=False)
    status      = SmallIntegerField(max_length=1, choices=STATUS_CHOICES, default=1) 
    
    def __unicode__ (self):
        if hasattr(self, "author") and self.author:
            return self.author
        else:
            return "%s" % (type(self))



class Page(Base):
    """
        One page of the transcript.
        Represented by page number and a JPEG image of the page.    
    """    

    PAGE_CHOICES = [(i+1, str(i+1)) for i in range(86)]

    def image_filename (self, filename):
        return 'uploads/pages/%s' % (filename)

    number      = IntegerField(max_length=3, choices=PAGE_CHOICES, default=1)
    filename    = ImageField("Page",upload_to=image_filename)    

    def __unicode__ (self):
        return "page %i" % (self.number)




class Video(Base):
    """
        A video for a single page in the transcript.
        Videos are displayed via vimeo on the site:
        When an admin adds a video, it's already on vimeo.
        When a user adds a video, it enters the vimeo upload queue via their API
    """

    VIMEO_STATUS_CHOICES = (
        (0, 'None'),
        (1, 'In Queue'),
        (2, 'Uploaded'),
        (3, 'Ready')
    )

    def video_filename (self, filename):
        return 'uploads/page_%i/%s' % (self.page.id, filename)    

    page            = ForeignKey(Page)
    vimeo_status    = SmallIntegerField(max_length=1, choices=VIMEO_STATUS_CHOICES, default=0) 
    filename        = FileField(upload_to=video_filename, blank=True, null=True)    
    code            = CharField(max_length=255)    
    author          = CharField(max_length=255)
    
    def __unicode__ (self):
        return "page %i by %s" % (self.page.number, self.author)    
