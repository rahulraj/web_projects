import getopt
import sys
from ..utils.inject import assign_injectables

class GalleryGenerator(object):
  """
  The top level class for the application. This is the only object
  that the main function interacts with.
  """
  def __init__(self, gallery_item_factory, path, exporter):
    """
    Constructor for GalleryGenerator

    Args:
      gallery_item_factory the GalleryItemFactory that creates the items.
      path the path of the directory to start in.
      exporter the Exporter to populate the templates.
    """
    assign_injectables(self, locals())

  @classmethod
  def create_gallery_generator(clazz, command_line_arguments):
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
          "hi:o:", ['help', 'input-file=', 'output-file='])
    except getopt.GetoptError:
      clazz.print_usage()
      sys.exit(2)

    print 'options: ', options
    for option, argument in options:
      if option in ('-h', '--help'):
        clazz.print_usage()
        sys.exit(0)
      elif option in ('-i', '--input-file'):
        input_directory = argument
        print 'input_directory: ', input_directory
      elif option in ('-o', '--output-file'):
        output_directory = argument
        print 'output_directory: ', output_directory
    return None

  @classmethod
  def print_usage(clazz):
    print "Please call this script with the following arguments:"
    print "-i my_pictures/ where my_pictures is the directory containing " + \
        "the JPEGs to render (long form: --input-file=)"
    print "-o my_site/ where my_site is the directory in which to " + \
        "write the output files (long form: --output-file=)"
    print "Calling this script with -h or --help prints this message " + \
        "and exits."


  def run(self):
    top_directory = self.gallery_item_factory.create_directory(self.path)
    directory_view = top_directory.as_directory_view()
    populated_templates = self.exporter.export(directory_view)
