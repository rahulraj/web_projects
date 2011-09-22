from jinja2 import Environment, PackageLoader
from ..utils.inject import assign_injectables

PHOTO_DIRECTORY_TEMPLATE_NAME = 'photo-directory.html'
PHOTO_DETAIL_TEMPLATE_NAME = 'photo-detail.html'

class Exporter(object):
  def __init__(self, jinja_template):
    """
    Constructor for an exporter. It can export either
    a JpegDirectory or a JpegPicture.

    Args:
      jinja_template - the Template to populate
    """
    assign_injectables(self, locals())

  def export(self, view):
    """
    Given an ImmutableDict with which to populate the template,
    render the template and return it.
    """
    return self.jinja_template.render(view)

def create_photo_detail_exporter():
  return create_exporter(PHOTO_DETAIL_TEMPLATE_NAME)

def create_photo_directory_exporter():
  return create_exporter(PHOTO_DIRECTORY_TEMPLATE_NAME)

def create_exporter(template_name):
  environment = Environment(loader=PackageLoader('photogallery', 'templates'))
  return Exporter(environment.get_template(template_name))
