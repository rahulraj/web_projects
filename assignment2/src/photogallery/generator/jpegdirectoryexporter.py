class JpegDirectoryExporter(object):
  """
  Class to take a JpegDirectory and export it as a HTML
  file using Jinja2 templates. Each directory will have
  its own page, and the pages will be nested the same way
  the directories are nested on the user's filesystem.
  """
