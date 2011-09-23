import os
import getopt
import sys
from ..utils.inject import assign_injectables
import template_writer

class GalleryGenerator(object):
  """
  The top level class for the application. This is the only object
  that the main function interacts with.
  """
  def __init__(self, gallery_item_factory, path, exporter, template_writer):
    """
    Constructor for GalleryGenerator. All needed service objects are injected.

    Args:
      gallery_item_factory the GalleryItemFactory that creates the items.
      path the path of the directory to start in.
      exporter the Exporter to populate the templates.
      template_writer the object that writes the templates to disk
    """
    assign_injectables(self, locals())

  def run(self):
    top_jpeg_directory = self.gallery_item_factory.create_directory(self.path)
    directory_view = top_directory.as_directory_view()
    populated_templates = self.exporter.export(directory_view)
    self.template_writer.write_templates(populated_templates)


def create_gallery_generator(command_line_arguments):
  """
  Given command line arguments, wire up the application and return
  it to the main function.

  Acceptable command line arguments are:
  -h, --help -> Prints a help message
  --input-directory -> The root directory for the gallery (required)
  --output-directory -> the output directory for the HTML (required)

  Args:
    command_line_arguments the command line arguments with the program
                           name removed.
  """

  try:
    options, arguments = getopt.getopt(command_line_arguments,
        "hi:o:", ['help', 'input-directory=', 'output-directory='])
  except getopt.GetoptError:
    print_usage()
    sys.exit(2)

  has_input_directory = has_output_directory = False
  for option, argument in options:
    if option in ('-h', '--help'):
      print_usage()
      sys.exit(0)
    elif option in ('-i', '--input-directory'):
      input_directory = argument
      if not os.path.isdir(input_directory):
        print input_directory, "doesn't appear to be a directory."
        print_usage()
        sys.exit(1)
      has_input_directory = True
    elif option in ('-o', '--output-directory'):
      output_directory = argument
      has_output_directory = True

  if not has_input_directory or not has_output_directory:
    print_usage() 
    sys.exit(1)
  print 'Still under construction!'
  sys.exit(0)

def print_usage(clazz):
  print "Please call this script with the following arguments:"
  print "-i my_pictures/ where my_pictures is the directory containing " + \
      "the JPEGs to render (long form: --input-file=)"
  print "-o my_site/ where my_site is the directory in which to " + \
      "write the output files (long form: --output-file=)"
  print "Calling this script with -h or --help prints this message " + \
      "and exits."
