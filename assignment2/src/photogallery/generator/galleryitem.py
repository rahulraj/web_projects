from ..utils.inject import assign_injectables
from ..utils.getters import with_getters_for
from ..utils.immutabledict import ImmutableDict
import exporter


class GalleryItem(object):
  """ 
  A single item in the gallery, can be either a JPEG or a
  directory containing other GalleryItems.     
  """
  def get_name(self):
    raise NotImplementedError

  def as_view(self):
    raise NotImplementedError

  def get_contents(self):
    raise NotImplementedError

  def get_exporter(self):
    raise NotImplementedError


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

  def get_contents(self):
    """ A single picture has no contents, so return an empty list. """
    return []

  def get_exporter(self):
    """ To export self, we need the picture detail template. """
    return exporter.create_photo_detail_exporter()

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

  def get_all_attributes(self):
    """
    Returns all of the attribute names in self.lookup_table.
    Used for making the caption.

    Returns:
      An ImmutableDict mapping all the available attribute names
      to their values.
    """
    result = {}
    for attribute_name in self.lookup_table:
      result[attribute_name] = self.lookup(attribute_name)
    return ImmutableDict(result)

  def __str__(self):
    return 'JpegPicture(' + self.name + ')'

  def __repr__(self):
    return self.__str__()

  def build_caption(self):
    """
    Pretty-prints all of the attributes associated with this JPEG picture
    into a caption.

    Returns:
      A string caption that can be put in the template.
    """
    caption = ''
    attributes = self.get_all_attributes()
    for attribute in attributes:
      caption += attribute + ": "
      caption += self.lookup(attribute) + "\n"
    return caption

  def as_view(self):
    """
    Injects self's data into a JpegPictureView and returns it.
    The result can be sent to a template.

    Returns:
      A new ImmutableDict containing data about self.
    """
    result = {}
    if 'alt_text' in self.lookup_table:
      result['alt_text'] = self.lookup('alt_text')
    else:
      result['alt_text'] = self.name

    result['src'] = self.name
    result['caption_data'] = self.build_caption()
    return ImmutableDict(result)
with_getters_for(JpegPicture, 'name')


class JpegDirectory(GalleryItem):
  def __init__(self, name, contents):
    """
    Constructor for JpegDirectories.

    Args:
      name the name of the directory.
      contents a list of GalleryItems inside the directory.
    """
    assign_injectables(self, locals())

  def as_view(self):
    """
    Creates a view of this object that can be sent to the template.

    Returns:
      An ImmutableDict with data about this object to be displayed.
    """
    result = {}
    result['title'] = self.name
    images = [jpeg for jpeg in self.contents if isinstance(jpeg, JpegPicture)]
    result['images'] = [picture.as_picture_view for picture in images]
    return ImmutableDict(result)

  def get_exporter():
    """ We need a directory exporter. """
    return exporter.create_photo_directory_exporter()

  def __str__(self):
    return 'JpegDirectory(' + self.name + ')'

  def __repr__(self):
    return self.__str__()
with_getters_for(JpegDirectory, 'name', 'contents')
