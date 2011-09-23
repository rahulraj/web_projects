import shutil
import os
import os.path
from galleryitemfactory import is_jpeg_file

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
  contents = os.listdir(from_directory)
  for entry in contents:
    full_entry = os.path.join(from_directory, entry)
    if os.path.isdir(full_entry):
      copy_jpegs(full_entry, to_directory)
    elif is_jpeg_file(full_entry):
      shutil.copy2(full_entry, to_directory)
