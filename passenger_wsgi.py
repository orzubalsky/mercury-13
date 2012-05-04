import sys, os
INTERP = os.path.join(os.environ['HOME'], 'env', 'bin', 'python')
#if sys.executable != INTERP:
#    os.execl(INTERP, INTERP, *sys.argv)
# Python has no prepend function, so we must do an insert. We insert the key directories
# BEFORE ANYTHING, so the python installation sees them before the system-wide libraries.

sys.path.insert(0,'/home/theyoungest_django/env/bin')
sys.path.insert(0,'/home/theyoungest_django/env/lib/python2.5/site-packages/Django-1.3-py2.5.egg')
sys.path.insert(0,'/home/theyoungest_django/env/lib/python2.5/site-packages')
sys.path.append(os.getcwd())
sys.path.append(os.path.join(os.getcwd(), '/home/theyoungest_django/nasa.lu/m13_transcript'))
 
os.environ['DJANGO_SETTINGS_MODULE'] = "m13_transcript.settings"
import django.core.handlers.wsgi
application = django.core.handlers.wsgi.WSGIHandler()
