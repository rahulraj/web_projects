from jinja2 import Environment, PackageLoader
from ..utils.inject import assign_injectables
from ..utils.getters import with_getters_for

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

  def export(self, gallery_item):
    """
    Given a GalleryItem with which to populate the template,
    render the template(s) and return them. If gallery_item
    is a directory, this method recurses on its contents.

    Returns:
      A list of all the templates that were populated, as
      HtmlFileNameAndContents. There's one for each GalleryItem.
    """
    contents = gallery_item.get_contents()
    templates = [HtmlFileNameAndContents(gallery_item.get_name(), 
        gallery_item.as_view())]
    for entry in contents:
      appropriate_exporter = entry.get_exporter()
      templates.extend(appropriate_exporter.export(entry))
    return templates

class HtmlFileNameAndContents(object):
  """
  A simple immutable data object that bundles the prospective
  name of a file and its contents; the output value of Exporter.
  """
  def __init__(self, file_name, contents):
    assign_injectables(self, locals())
with_getters_for(HtmlFileNameAndContents, 'file_name', 'contents')

def create_photo_detail_exporter():
  return create_exporter(PHOTO_DETAIL_TEMPLATE_NAME)

def create_photo_directory_exporter():
  return create_exporter(PHOTO_DIRECTORY_TEMPLATE_NAME)

def create_exporter(template_name):
  environment = Environment(loader=PackageLoader('photogallery', 'templates'))
  return Exporter(environment.get_template(template_name))
