from iptcinfo import IPTCInfo
from ..utils.inject import assign_injectables

class GalleryItem(object):
  """ 
  A single item in the gallery, can be either a JPEG or a
  directory containing other GalleryItems.     
  """
  pass

class JpegPicture(GalleryItem):
  """ A single immutable JPEG picture """
  def __init__(self, file_name, iptc_info, lookup_table):
    """
    Constructor for JpegPictures.

    Args:
      file_name the name of the JPEG file
      iptc_info the IPTCInfo object wrapped around the file
      lookup_table an immutable dictionary mapping metadata
                   attribute names to their indices in iptc_info.data
    """
    assign_injectables(self, locals())

class JpegDirectory(GalleryItem):
  def __init__(self, directory_name, contents):
    """
    Constructor for JpegDirectories.

    Args:
      directory_name the name of the directory
      contents a list of GalleryItems inside the directory
    """
    assign_injectables(self, locals())
