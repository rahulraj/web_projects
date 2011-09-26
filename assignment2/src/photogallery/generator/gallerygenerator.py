import os
import getopt
import sys
from ..utils.inject import assign_injectables
from ..utils.immutabledict import ImmutableDict
from manifestparser import ManifestParser
from galleryitemfactory import GalleryItemFactory
import exporter
import templatewriter
import copier

class GalleryGenerator(object):
  """
  The top level class for the application. This is the only object
  that the main function interacts with.
  """
  def __init__(self, gallery_item_factory, input_directory, output_directory,
      static_files_directory, exporter, template_writer):
    """
    Constructor for GalleryGenerator. All needed service objects are injected.

    Args:
      gallery_item_factory the GalleryItemFactory that creates the items.
      input_directory the path of the directory to start in.
      output_directory the directory to which files should be written.
      static_files_directory the directory containing static files to copy over.
      exporter the Exporter to populate the templates.
      template_writer the object that writes the templates to disk.
    """
    assign_injectables(self, locals())

  def run(self):
    top_jpeg_directory = \
        self.gallery_item_factory.create_directory(self.input_directory)
    populated_templates = self.exporter.export(top_jpeg_directory)
    self.template_writer.write_templates(populated_templates)
    # We need to copy the JPEGs over too, and the CSS
    copier.copy_jpegs(self.input_directory, self.output_directory)
    copier.copy_css(self.static_files_directory, self.output_directory)
    # Also, if there are scripts that enhance the experience,
    # copy them over too.
    copier.copy_javascript(self.static_files_directory, self.output_directory)
    # Also grab a copy of directory_image.jpg
    copier.copy_jpegs(self.static_files_directory, self.output_directory)


def create_gallery_generator(command_line_arguments, css_directory):
  """
  Given command line arguments, wire up the application and return
  it to the main function. This requires creating most of the objects
  described in the other files from this directory.

  Args:
    command_line_arguments the command line arguments with the program
                           name removed.
    css_directory the directory containing the CSS files.
  """
  input_data = parse_command_line_arguments(command_line_arguments)
  # First parse the manifest file
  with open(input_data['manifest_file'], 'r') as manifest_file:
    parser = ManifestParser(manifest_file)
    lookup_table = parser.get_json_data()
  factory = GalleryItemFactory(lookup_table, input_data['should_prompt'])
  template_exporter = exporter.create_photo_directory_exporter()
  template_writer = \
      templatewriter.create_template_writer(input_data['output_directory'])
  return GalleryGenerator(gallery_item_factory=factory,
      input_directory=input_data['input_directory'],
      output_directory=input_data['output_directory'],
      static_files_directory=css_directory,
      exporter=template_exporter,
      template_writer=template_writer)

def parse_command_line_arguments(command_line_arguments):
  """
  Acceptable command line arguments are:
  -h, --help -> Prints a help message
  -i, --input-directory -> The root directory for the gallery (required)
  -o, --output-directory -> the output directory for the HTML (required)
  -n, --no-prompt -> Automatically use inferred names for directories,
                 instead of prompting the user.

  Args:
    command_line_arguments the command line arguments with the program
                           name removed.
  """
  try:
    options, arguments = getopt.getopt(command_line_arguments,
        "hi:o:m:n", ['help', 'input-directory=', 'output-directory=',
          'manifest-file=', 'no-prompt'])
  except getopt.GetoptError:
    print_usage()
    sys.exit(2)

  input_data = {'should_prompt': True}
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
    elif option in ('-n', '--no-prompt'):
      input_data['should_prompt'] = False

  if 'input_directory' not in input_data \
      or 'output_directory' not in input_data \
      or 'manifest_file' not in input_data:
    print_usage() 
    sys.exit(1)

  return ImmutableDict(input_data)

def print_usage():
  print "Please call this script with the following arguments:"
  print "-i my_pictures/ where my_pictures is the directory containing " + \
      "the JPEGs to render (long form: --input-directory=)"
  print "-o my_site/ where my_site is the directory in which to " + \
      "write the output files (long form: --output-directory=)"
  print "-m manifest.json where manifest.json is a manifest file " + \
      "describing the JPEGs' metadata as a JSON string (long form:" + \
        "--manifest_file=)"
  print "-n Automatically infer directory titles instead of asking, " + \
      "will ask by default. (long form: --no-prompt)"
  print "Calling this script with -h or --help prints this message " + \
      "and exits."
