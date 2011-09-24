import os
import re
import os.path
from iptcinfo import IPTCInfo
from galleryitem import JpegPicture, JpegDirectory, directory_name_to_html_file_name
from ..utils.inject import assign_injectables

def is_jpeg_file(file_name):
  """
  Determine if a file is labeled as a JPEG.

  Args:
    file_name the name of the file.

  Returns:
    True if the file ends with .jpg.
  """
  return file_is_of_type(file_name, 'jpg')

def is_css_file(file_name):
  """
  Determine if a file is labeled as CSS.

  Args:
    file_name the name of the file.

  Returns:
    True if the file ends with .css.
  """
  return file_is_of_type(file_name, 'css')
  

def file_is_of_type(file_name, extension):
  """
  Return whether a file is of a certain type.

  Args:
    file_name the name of the file to test.
    extension the part of the name after the . which will be checked
              with a regular expression. 

  Returns:
    True if file_name ends with extension.
  """
  type_re = re.compile(r'\.%s' % extension)
  return type_re.search(file_name) != None


class GalleryItemFactory(object):
  """
  Class to bootstrap the application by reading the disk and
  creating GalleryItems from the existing JPEGs and subdirectories.
  """
  def __init__(self, lookup_table, should_prompt,
      iptc_info_constructor=IPTCInfo,
      file_finder=os, is_directory=os.path.isdir):
    """
    Constructor for GalleryItemFactory

    Args:
      lookup_table the lookup_table that the files use to search IPTCInfo.data.
      should_prompt whether the program should prompt the user for directory 
                    names.
      iptc_info_constructor the constructor for IPTCInfo objects that the files 
                            will use to lookup metadata (defaults to IPTCInfo).
      file_finder the object that finds the files (defaults to os).
      is_directory a function that takes a file name and returns true if it
                   is  a directory (defaults to os.path.isdir).
    """
    assign_injectables(self, locals())

  def create_directory(self, path):
    """
    Creates a JpegDirectory object with the appropriate GalleryItems

    Args:
      path the path to the directory that the JPEGs are stored in.
    """
    file_names = self.file_finder.listdir(path)
    jpeg_names = filter(is_jpeg_file, file_names)

    path_contents = []
    for name in jpeg_names:
      full_file_name = os.path.join(path, name)
      try:
        path_contents.append(JpegPicture(name,
          directory_name_to_html_file_name(path),
          self.iptc_info_constructor(full_file_name),
            self.lookup_table))
      except IOError:
        print "I was unable to open the file ", name, " for some reason"
        print "Maybe it's corrupted?"
        print "Skipping it..."
      except Exception as possible_iptc_exception:
        if str(possible_iptc_exception) == 'No IPTC data found.':
          print "I was unable to get IPTC data from the file %s" % name
          print "Skipping it..."
        else:
          raise possible_iptc_exception # Some other exception


    full_file_name = [os.path.join(path, name) for name in file_names]
    #import ipdb; ipdb.set_trace()
    directory_names = filter(self.is_directory, full_file_name)
    jpeg_directories = map(self.create_directory, directory_names)
    path_contents.extend(jpeg_directories)
    return JpegDirectory(path, path_contents, self.should_prompt)
