from ..utils.inject import assign_injectables

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
  def __init__(self, file_name, iptc_info, lookup_table):
    """
    Constructor for JpegPictures.

    Args:
      file_name the name of the JPEG file.
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

  def __eq__(self, other):
    """
    For testing, allow JpegPictures to be compared by value.

    Returns:
      True if the unique aspects of self equal those of the other object.
    """
    if not isinstance(other, JpegPicture):
      return False
    return self.file_name == other.file_name and \
        self.lookup_table == other.lookup_table


class JpegDirectory(GalleryItem):
  def __init__(self, directory_name, contents):
    """
    Constructor for JpegDirectories.

    Args:
      directory_name the name of the directory.
      contents a list of GalleryItems inside the directory.
    """
    assign_injectables(self, locals())

  def __eq__(self, other):
    """
    For testing, allow JpegDirectories to be compared by value.

    Returns:
      True if the unique aspects of self equal those of other.
    """
    if not isinstance(other, JpegDirectory):
      return False
    return self.directory_name == other.directory_name
