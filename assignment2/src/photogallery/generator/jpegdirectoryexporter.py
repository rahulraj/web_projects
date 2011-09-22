from ..utils.inject import assign_injectables

PHOTO_DIRECTORY_TEMPLATE_NAME = 'photo-directory.html'
PHOTO_DETAIL_TEMPLATE_NAME = 'photo-detail.html'


class JpegDirectoryExporter(object):
  """
  Class to take a JpegDirectory and export it as a HTML
  file using Jinja2 templates. Each directory will have
  its own page, and the pages will be nested the same way
  the directories are nested on the user's filesystem.

  Args:
    jinja_template - the Template to populate
  """
  def __init__(self, jinja_template):
    assign_injectables(self, locals())

  def export_directory(self, jpeg_directory_view):
    return self.jinja_template.render({'title': jpeg_directory_view.title, 
        'images': jpeg_directory_view.images})


class JpegPictureExporter(object):
  """
  Exports the details of a single JPEG picture as a
  HTML file, using Jinja2 templates. All JPEGs have
  a detail page.
  """
  pass
