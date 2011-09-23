import os
import re
import os.path
from iptcinfo import IPTCInfo
from galleryitem import JpegPicture, JpegDirectory
from ..utils.inject import assign_injectables

def is_jpeg_file(file_name):
  jpeg_file_re = re.compile(r'\.jpg$')
  return jpeg_file_re.search(file_name) != None


class GalleryItemFactory(object):
  """
  Class to bootstrap the application by reading the disk and
  creating GalleryItems from the existing JPEGs and subdirectories.
  """
  def __init__(self, lookup_table,  iptc_info_constructor=IPTCInfo,
      file_finder=os, is_directory=os.path.isdir):
    """
    Constructor for GalleryItemFactory

    Args:
      lookup_table the lookup_table that the files use to search IPTCInfo.data.
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

    jpeg_pictures = []
    for name in jpeg_names:
      full_file_name = os.path.join(path, name)
      try:
        jpeg_pictures.append(JpegPicture(name,
          self.iptc_info_constructor(full_file_name),
            self.lookup_table))
      except IOError:
        print "I was unable to open the file ", name, " for some reason"
        print "Maybe it's corrupted?"
        print "Skipping it..."

    directory_names = filter(self.is_directory, file_names)
    jpeg_directories = map(self.create_directory, directory_names)
    jpeg_pictures.extend(jpeg_directories)
    return JpegDirectory(path, jpeg_pictures)
