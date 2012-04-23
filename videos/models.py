from django.db.models import *
import os,sys
import urllib, urllib2, json, random


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
    def videos(self):
        return Video.objects.filter(page_id = self.id).count()

    number      = IntegerField(max_length=3, choices=PAGE_CHOICES, default=1, verbose_name="page number")
    filename    = ImageField("Image",upload_to=image_filename)    

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
  
    def image_filename (self, filename):
        return 'uploads/page_%i/%s' % (page.number, filename)
          
    page            = ForeignKey(Page)
    vimeo_status    = SmallIntegerField(max_length=1, choices=VIMEO_STATUS_CHOICES, default=3) 
    thumbnail       = ImageField("Thumbnail",upload_to=image_filename, blank=True, null=True)    
    code            = CharField(max_length=255, verbose_name="Vimeo ID")    
    author          = CharField(max_length=255)
    
    def save(self, *args, **kwargs):
        response = urllib2.urlopen('http://vimeo.com/api/v2/video/%s.json' % (self.code))        
        data = json.loads(response.read(), encoding='utf-8')
        thumbnail_url =  data[0][u'thumbnail_small']
        
        dirname = settings.MEDIA_ROOT + '/uploads/page_%i/' % (self.page.number)
        if not os.path.exists(dirname):
            os.mkdir(os.path.join(settings.MEDIA_ROOT, dirname))
        filePath = 'thumbnail_%i.jpg' % (random.randint(0,999))
        downloaded_image = file(dirname + filePath, "wb")
        image_on_web = urllib.urlopen(thumbnail_url)
        while True:
            buf = image_on_web.read(65536)
            if len(buf) == 0:
                break
            downloaded_image.write(buf)
        downloaded_image.close()
        image_on_web.close()
        
        self.thumbnail = 'uploads/page_%i/' % (self.page.number) + filePath
        super(Video, self).save(*args, **kwargs)    
    
    def __unicode__ (self):
        return "page %i by %s" % (self.page.number, self.author)    
