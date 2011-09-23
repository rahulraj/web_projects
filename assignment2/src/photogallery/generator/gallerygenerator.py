import os
import getopt
import sys
from ..utils.inject import assign_injectables
from ..utils.immutabledict import ImmutableDict
from manifestparser import ManifestParser
from galleryitemfactory import GalleryItemFactory
import exporter
import templatewriter

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
    directory_view = top_jpeg_directory.as_directory_view()
    populated_templates = self.exporter.export(directory_view)
    self.template_writer.write_templates(populated_templates)


def create_gallery_generator(command_line_arguments):
  """
  Given command line arguments, wire up the application and return
  it to the main function. This requires creating most of the objects
  described in the other files from this directory.

  Args:
    command_line_arguments the command line arguments with the program
                           name removed.
  """
  input_data = parse_command_line_arguments(command_line_arguments)
  # First parse the manifest file
  with open(input_data['manifest_file'], 'r') as manifest_file:
    parser = ManifestParser(manifest_file)
    lookup_table = parser.get_json_data()
  factory = GalleryItemFactory(lookup_table)
  template_exporter = exporter.create_photo_directory_exporter()
  template_writer = \
      templatewriter.create_template_writer(input_data['output_directory'])
  return GalleryGenerator(gallery_item_factory=factory,
      path=input_data['input_directory'],
      exporter=template_exporter,
      template_writer=template_writer)

def parse_command_line_arguments(command_line_arguments):
  """
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
        "hi:o:m:", ['help', 'input-directory=', 'output-directory=',
          'manifest-file='])
  except getopt.GetoptError:
    print_usage()
    sys.exit(2)

  input_data = {}
  for option, argument in options:
    if option in ('-h', '--help'):
      print_usage()
      sys.exit(0)
    elif option in ('-i', '--input-directory'):
      if os.path.isdir(argument):
        input_data['input_directory'] = argument
      else:
        print argument, "doesn't appear to be a directory."
        print_usage()
        sys.exit(1)
    elif option in ('-o', '--output-directory'):
      input_data['output_directory'] = argument
    elif option in ('-m', '--manifest-file'):
      if os.path.isfile(argument):
        input_data['manifest_file'] = argument
      else:
        print argument, "file couldn't be read for some reason."
        print_usage()
        sys.exit(1)

  if 'input_directory' not in input_data \
      or 'output_directory' not in input_data \
      or 'manifest_file' not in input_data:
    print_usage() 
    sys.exit(1)

  return ImmutableDict(input_data)

def print_usage():
  print "Please call this script with the following arguments:"
  print "-i my_pictures/ where my_pictures is the directory containing " + \
      "the JPEGs to render (long form: --input-file=)"
  print "-o my_site/ where my_site is the directory in which to " + \
      "write the output files (long form: --output-file=)"
  print "-m manifest.json where manifest.json is a manifest file " + \
      "describing the JPEGs' metadata as a JSON string (long form:" + \
        "--manifest_file=)"
  print "Calling this script with -h or --help prints this message " + \
      "and exits."
