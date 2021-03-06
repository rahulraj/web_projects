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


def is_js_file(file_name):
  """
  Determine if a file is labeled as JavaScript.

  Args:
    file_name the name of the file.

  Returns:
    True if the file ends with .js.
  """
  return file_is_of_type(file_name, 'js')
  

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
      list_directory=os.listdir, is_directory=os.path.isdir):
    """
    Constructor for GalleryItemFactory

    Args:
      lookup_table the lookup_table that the files use to search IPTCInfo.data.
      should_prompt whether the program should prompt the user for directory 
                    names.
      iptc_info_constructor the constructor for IPTCInfo objects that the files 
                            will use to lookup metadata (defaults to IPTCInfo).
      list_directory the function that takes a path and lists the files in it,
                     defaults to os.listdir
      is_directory a function that takes a file name and returns true if it
                   is  a directory (defaults to os.path.isdir).
    """
    assign_injectables(self, locals())

  def create_directory(self, path, parent_path=None):
    """
    Creates a JpegDirectory object with the appropriate GalleryItems

    Args:
      path the path to the directory that the JPEGs are stored in.
      parent_path the directory one level up of path; if we are creating
                  a subdirectory this will be used to populate back_href.
                  It can be None if we are creating the top-most directory.

    Returns:
      A JpegDirectory containing GalleryItems wrapped around all the appropriate
      contents of the directory referred to by path.

    Raises:
      Any exception thrown when trying to extract IPTC information from a JPEG
      file. See the documentation of try_create_jpeg_picture for details.
    """
    file_names = self.list_directory(path)
    jpeg_names = filter(is_jpeg_file, file_names)

    path_contents = []

    for name in jpeg_names:
      maybe_jpeg_picture = self.try_create_jpeg_picture(path, name)
      if maybe_jpeg_picture is not None:
        path_contents.append(maybe_jpeg_picture)

    subdirectories = self.create_subdirectories(file_names, path)
    path_contents.extend(subdirectories)
    back_href = self.maybe_get_back_href(parent_path)
    return JpegDirectory(path, path_contents, self.should_prompt,
        back_href=back_href)

  def try_create_jpeg_picture(self, path, name):
    """
    Given a path and the name of a file ending in .jpg, tries to create
    a JpegPicture object out of it.

    Args:
      path the path to the directory the file is in.
      name the name of the file.

    Returns:
      A JpegPicture object, if creating it was successful. None if creating
      the JpegPicture failed for some reason that does not warrant crashing
      the program.

    Raises:
      Any exception raised when trying to extract IPTC information from the
      JPEG, that is not an IOError or an exception with the message 
      'No IPTC data found.' In those two cases, simply skips the file and
      prints a message saying so.
    """
    full_jpeg_name = os.path.join(path, name)
    try:
      return JpegPicture(name,
        directory_name_to_html_file_name(path),
        self.iptc_info_constructor(full_jpeg_name),
          self.lookup_table)
    except IOError:
      print "I was unable to open the file ", name, " for some reason"
      print "Maybe it's corrupted?"
      print "Skipping it..."
      return None
    except Exception as possible_iptc_exception:
      if str(possible_iptc_exception) == 'No IPTC data found.':
        print "I was unable to get IPTC data from the file %s" % name
        print "Skipping it..."
        return None
      else:
        raise possible_iptc_exception # Some other exception

  def maybe_get_back_href(self, path):
    """
    Given a nullable path name, turns it into a href that can be used
    to write an anchor tag pointing to a HTML file. If path
    is None, propagates the None by returning it.

    Args:
      path the path name, or None if it is not applicable.
    """
    if path is None:
     return None
    else:
      return directory_name_to_html_file_name(path)

  def create_subdirectories(self, file_names, path):
    """
    Helper methods to find the subdirectories of path and create JpegDirectories
    for them, fully initializing their contents too.

    Args:
      file_names the names of the files in path.
      path the root directory path to process.
    """
    full_file_names = [os.path.join(path, name) for name in file_names]
    directory_names = filter(self.is_directory, full_file_names)
    jpeg_directories = [self.create_directory(directory_name, parent_path=path) \
        for directory_name in directory_names]
    return jpeg_directories
