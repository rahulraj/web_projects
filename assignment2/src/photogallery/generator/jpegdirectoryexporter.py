from ..utils.inject import assign_injectables

class JpegDirectoryExporter(object):
  """
  Class to take a JpegDirectory and export it as a HTML
  file using Jinja2 templates. Each directory will have
  its own page, and the pages will be nested the same way
  the directories are nested on the user's filesystem.
  """
  def __init__(self, jinja_environment):
    assign_injectables(self, locals())
