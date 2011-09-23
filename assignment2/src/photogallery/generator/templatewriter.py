from ..utils.inject import assign_injectables
import os
import os.path

class TemplateWriter(object):
  """
  Class to write populated templates to the disk.
  """
  def __init__(self, output_directory):
    """
    Constructor for TemplateWriter

    Args:
      output_directory the directory in which to place output files.
    """
    assign_injectables(self, locals())

  def write_templates(self, templates):
    """
    Given a list of HtmlFileNameAndContents, create files for all of them
    and write the populated templates into the files.

    Args:
      templates the HtmlFileNameAndContents describing the files to be made.

    Effects:
      Performs IO by writing multiple files to disk.
    """
    for template in templates:
      output_file = self.output_directory + template.get_name()
      with open(output_file, 'w') as template_out_file:
        template_out_file.write(template.get_contents())

def create_template_writer(directory_name):
  """
  Factory function for TemplateWriter, ensures that the
  directory exists, and creates it if necessary.

  Args:
      directory_name the name of the directory to place output files.
  """
  if not os.path.isdir(directory_name):
    os.makedirs(directory_name)
  return TemplateWriter(directory_name)
