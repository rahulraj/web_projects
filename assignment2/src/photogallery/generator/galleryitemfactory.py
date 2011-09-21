import os
import re
from galleryitem import JpegPicture, JpegDirectory
from ..utils.inject import assign_injectables

class GalleryItemFactory(object):
  """
  Class to bootstrap the application by reading the disk and
  creating GalleryItems from the existing JPEGs and subdirectories.
  """
  def __init__(self, iptc_info, lookup_table, file_finder=os):
    """
    Constructor for GalleryItemFactory

    Args:
      iptc_info the IPTCInfo object that the files will use to lookup metadata.
      lookup_table the lookup_table that the files use to search IPTCInfo.data
      file_finder the object that finds the files (defaults to os)
    """
    assign_injectables(self, locals())

  def create_directory(self, path):
    """
    Creates a JpegDirectory object with the appropriate JpegPictures

    Args:
      path the path to the directory that the JPEGs are stored in.
    """
    file_names = self.file_finder.listdir(path)
    jpg_file_re = re.compile(r'\.jpg$')
    jpegs = [name for name in file_names if jpg_file_re.search(name) != None]
    jpeg_pictures = [JpegPicture(name, self.iptc_info, self.lookup_table) \
        for name in jpegs]
    return JpegDirectory(path, jpeg_pictures)
