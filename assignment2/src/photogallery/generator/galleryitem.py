from ..utils.inject import assign_injectables
from ..utils.getters import with_getters_for

class GalleryItem(object):
  """ 
  A single item in the gallery, can be either a JPEG or a
  directory containing other GalleryItems.     
  """
  pass


class NoSuchMetadata(Exception):
  pass


class JpegPicture(GalleryItem):
  """ A single immutable JPEG picture """
  def __init__(self, name, iptc_info, lookup_table):
    """
    Constructor for JpegPictures.

    Args:
      name the name of the JPEG file.
      iptc_info the IPTCInfo object wrapped around the file.
      lookup_table an immutable dictionary mapping metadata
                   attribute names to their indices in iptc_info.data.
    """
    assign_injectables(self, locals())

  def lookup(self, attribute_name):
    """
    Given the name of an attribute, finds that attribute in the JPEG's
    metadata via iptc_info, using lookup_table to map attribute names
    to keys in iptc_info.data

    Args:
      attribute_name the name to look up.

    Returns:
      The value associated with attribute_name in the JPEG's metadata.

    Raises:
      NoSuchMetadata if attribute_name does not exist in the lookup table.
    """
    if attribute_name not in self.lookup_table:
      raise NoSuchMetadata, attribute_name
    iptc_info_key = self.lookup_table[attribute_name]
    return self.iptc_info.data[iptc_info_key]

  def __str__(self):
    return 'JpegPicture(' + self.name + ')'

  def __repr__(self):
    return self.__str__()
with_getters_for(JpegPicture, 'name')


class JpegDirectory(GalleryItem):
  def __init__(self, name, contents):
    """
    Constructor for JpegDirectories.

    Args:
      name the name of the directory.
      contents a tuple of GalleryItems inside the directory.
    """
    assign_injectables(self, locals())

  def __str__(self):
    return 'JpegDirectory(' + self.name + ')'

  def __repr__(self):
    return self.__str__()
with_getters_for(JpegDirectory, 'name', 'contents')
