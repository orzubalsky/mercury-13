from django.db.models import *
import os,sys

"""
   Base model     
"""
class Base(Model):

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


"""
    The page class     
"""
class Page(Base):

    PAGE_CHOICES = [(i+1, str(i+1)) for i in range(86)]

    def image_filename (self, filename):
        return 'uploads/pages/%s' % (filename)

    number      = IntegerField(max_length=3, choices=PAGE_CHOICES, default=1)
    filename    = ImageField("Page",upload_to=image_filename)    

    def __unicode__ (self):
        return "page %i" % (self.number)



"""
    The Venue class     
"""
class Video(Base):

    VIMEO_STATUS_CHOICES = (
        (0, 'None'),
        (1, 'In Queue'),
        (2, 'Uploaded'),
        (3, 'Processed')
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
