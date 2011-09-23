from ..utils.inject import assign_injectables
import os
import os.path

class TemplateWriter(object):
  """
  Class to write populated templates to the disk.
  """
  def __init__(self, output_directory):
    assign_injectables(self, locals())

  def write_templates(templates):
    pass

def create_template_writer(directory_name):
  """
  Factory function for TemplateWriter, ensures that the
  directory exists, and creates it if necessary.
  """
  if not os.path.isdir(directory_name):
    os.makedirs(directory_name)
  return TemplateWriter(directory_name)
