from ..utils.inject import assign_injectables
from ..utils.getters import with_getters_for
from ..utils.immutabledict import ImmutableDict
import exporter


class GalleryItem(object):
  """ 
  A single item in the gallery, can be either a JPEG or a
  directory containing other GalleryItems. Specifies an interface
  that should be implemented by subclasses (currently, implemented by
  JpegPicture and JpegDirectory)
  """
  def get_name(self):
    raise NotImplementedError

  def as_view(self):
    raise NotImplementedError

  def get_contents(self):
    raise NotImplementedError

  def get_exporter(self):
    raise NotImplementedError

  def get_output_file_name(self):
    raise NotImplementedError


class NoSuchMetadata(Exception):
  pass


class JpegPicture(GalleryItem):
  """ A single immutable JPEG picture """
  def __init__(self, name, back_href, iptc_info, lookup_table):
    """
    Constructor for JpegPictures.

    Args:
      name the name of the JPEG file.
      back_href the link to the parent directory.
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

  def get_output_file_name(self):
    """
    Convert self.name to an appropriate name for the output file.
    It should end in .html and not have any spaces.
    """
    return self.name.replace(' ', '-').replace('jpg', 'html')

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

  def build_caption(self):
    """
    Pretty-prints all of the attributes associated with this JPEG picture
    into a caption.

    Returns:
      A string caption that can be put in the template.
    """
    caption = []
    attributes = self.get_all_attributes()
    for attribute in attributes:
      attribute_string = attribute + ": "
      attribute_value = self.lookup(attribute)
      if attribute_value is None:
        result = 'No data for this image\n'
      else:
        result = attribute_value + "\n"
      caption.append(attribute_string + result)
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
    result['href'] = self.get_output_file_name()
    result['back_href'] = self.back_href
    return ImmutableDict(result)

  def __str__(self):
    return 'JpegPicture(' + self.name + ')'

  def __repr__(self):
    return self.__str__()
with_getters_for(JpegPicture, 'name')

def directory_name_to_html_file_name(directory_name):
    """ Remove leading and trailing /, if they exist. """
    to_process = directory_name.strip('/')
    no_illegal_chars = to_process.replace(' ', '-').replace('/', '-'). \
        replace('\\', '-').replace('.', '-')
    return no_illegal_chars + '.html'

class JpegDirectory(GalleryItem):
  def __init__(self, name, contents, should_prompt, back_href=None):
    """
    Constructor for JpegDirectories.

    Args:
      name the name of the directory.
      contents a list of GalleryItems inside the directory.
      should_prompt whether we should ask the user for a readable title.
      back_href the href for the parent directory, if it exists,
                or None if it doesn't. Unlike with JpegPictures, it is possible
                for back_href to be None.
    """
    assign_injectables(self, locals())
    self.human_readable_title = None

  def as_view(self):
    """
    Creates a view of this object that can be sent to the template.

    Returns:
      An ImmutableDict with data about this object to be displayed.
    """
    result = {}
    result['title'] = self.get_human_readable_title()
    result['images'] = [picture.as_view() for picture in self.contents]

    # Needed if this is being viewed as a subdirectory in photo-directory
    result['alt_text'] = self.get_output_file_name()
    result['src'] = 'directory_image.jpg'
    result['href'] = self.get_output_file_name()
    result['back_href'] = self.back_href
    return ImmutableDict(result)

  def get_exporter(self):
    """ Returns a directory exporter. """
    return exporter.create_photo_directory_exporter()

  def get_output_file_name(self):
    """ Convert self.name into an appropriate HTML file name."""
    return directory_name_to_html_file_name(self.name)

  def get_human_readable_title(self):
    """
    Try to infer a title for the template page.
    If allowed, prompt the user for a better version.
    """
    if self.human_readable_title is not None:
      return self.human_readable_title
    file_name = self.get_output_file_name()
    inferred_name = self.remove_extension(file_name) \
        .replace('-', ' ').replace('_', ' ').capitalize()
    if self.should_prompt:
      self.human_readable_title = raw_input( \
          "Name for the directory %s [%s]:" % \
          (self.get_name(), inferred_name))
      if self.human_readable_title.strip() == '':
        return inferred_name
      else:
        return self.human_readable_title
    else:
      return inferred_name

  def remove_extension(self, name):
    """
    Given a file name, removes its extension.

    Args:
      name the name to process.
    """
    dot_index = name.find('.')
    if dot_index == -1: # No extension
      return name
    return name[:dot_index]

  def __str__(self):
    return 'JpegDirectory(' + self.name + ')'

  def __repr__(self):
    return self.__str__()
with_getters_for(JpegDirectory, 'name', 'contents')
