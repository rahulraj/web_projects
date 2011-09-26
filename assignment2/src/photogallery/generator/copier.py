import shutil
import os
import os.path
from galleryitemfactory import is_jpeg_file, is_css_file, is_js_file

def copy_css(from_directory, to_directory):
  """
  Scans from_directory and finds all the CSS files in it and its subdirectories.
  Copies those CSS files to to_directory. Note that to_directory will have a flat
  structure for simplicity.

  Args:
    from_directory the directory to search for CSS files
    to_directory the directory to copy the CSS files to

  Effects:
    Copies files over the directories in the filesystem.
  """
  return copy_files_of_type(from_directory, to_directory, is_css_file)


def copy_jpegs(from_directory, to_directory):
  """
  Scans from_directory and finds all the JPEGs in it and its subdirectories.
  Copies those JPEGs to to_directory. Note that to_directory will have a flat
  structure for simplicity.

  Args:
    from_directory the directory to search for JPEGs
    to_directory the directory to copy the JPEGs to

  Effects:
    Copies files over the directories in the filesystem.
  """
  return copy_files_of_type(from_directory, to_directory, is_jpeg_file)


def copy_javascript(from_directory, to_directory):
  """
  Scans from_directory and finds all the JPEGs in it and its subdirectories.
  Copies those JPEGs to to_directory. Note that to_directory will have a flat
  structure for simplicity.

  Args:
    from_directory the directory to search for JPEGs
    to_directory the directory to copy the JPEGs to

  Effects:
    Copies files over the directories in the filesystem.
  """
  return copy_files_of_type(from_directory, to_directory, is_js_file)


def copy_files_of_type(from_directory, to_directory, type_tester):
  """
  Scans from_directory and finds all the appropriate files in it and its
  subdirectories.  Copies those files to to_directory. Note that to_directory 
  will have a flat structure for simplicity.

  Args:
    from_directory the directory to search for files.
    to_directory the directory to copy the files to.
    type_tester the function that determines whether a file name has the proper
                extension.

  Effects:
    Copies files over the directories in the filesystem.
  """
  contents = os.listdir(from_directory)
  for entry in contents:
    full_entry = os.path.join(from_directory, entry)
    if os.path.isdir(full_entry):
      copy_jpegs(full_entry, to_directory)
    elif type_tester(full_entry):
      shutil.copy2(full_entry, to_directory)
