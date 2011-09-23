import unittest
from ..generator.galleryitem import JpegPicture, NoSuchMetadata, JpegDirectory
from ..utils.immutabledict import ImmutableDict

class StubIptcInfo(object):
  """
  The tests inject an object of this class into the system under test
  so that unit tests can be run without having to read an actual JPEG picture,
  which is slower and harder to set up.
  """
  def __init__(self):
    # Stub data taken from 6170_sample_image_01.jpg
    self.data = \
       {20: [],
       25: ['Jerusalem'],
       55: '20110417',
       60: '041840-0400',
       62: '20110417',
       63: '041840-0400',
       80: 'Daniel Jackson',
       90: 'Jerusalem',
       101: 'Israel',
       118: [],
       120: 'Hike in Ein Kerem'}

class JpegPictureTest(unittest.TestCase):
  def setUp(self):
    self.stub_iptc_info = StubIptcInfo()
    self.metadata_dict = ImmutableDict({'Photographer': 80, 'City': 90,
        'Country': 101, 'Caption': 120})
    self.jpeg_picture = JpegPicture('file_name.jpg', self.stub_iptc_info,
        self.metadata_dict)

  def test_it_should_lookup_valid_metadata(self):
    self.assertEquals('Daniel Jackson',
        self.jpeg_picture.lookup('Photographer'))
    self.assertEquals('Jerusalem', self.jpeg_picture.lookup('City'))
    self.assertEquals('Israel', self.jpeg_picture.lookup('Country'))
    self.assertEquals('Hike in Ein Kerem', self.jpeg_picture.lookup('Caption'))

  def test_it_should_raise_NoSuchMetadata_when_looking_up_invalid_data(self):
    self.assertRaises(NoSuchMetadata, self.jpeg_picture.lookup,
        'not_real_attribute')

  def test_get_all_attributes(self):
    attributes = self.jpeg_picture.get_all_attributes()
    actual_attributes = {'Photographer': 'Daniel Jackson',
        'City': 'Jerusalem', 'Country': 'Israel', 'Caption': 'Hike in Ein Kerem'}
    self.assertEquals(actual_attributes, attributes)

  def test_it_should_create_a_caption_from_its_attributes(self):
    """ 
    For flexibility, this test doesn't match the caption exactly, it just
    verifies that the given information is in there.
    """
    caption = self.jpeg_picture.build_caption()
    self.assertTrue('Daniel Jackson' in caption)
    self.assertTrue('Jerusalem' in caption)
    self.assertTrue('Israel' in caption)
    self.assertTrue('Hike in Ein Kerem' in caption)

class OutputFileNameTest(unittest.TestCase):
  def setUp(self):
    self.stub_iptc_info = StubIptcInfo()
    self.metadata_dict = ImmutableDict({'Photographer': 80, 'City': 90,
        'Country': 101, 'Caption': 120})

  def test_simple_jpeg_picture_output_file_name(self):
    jpeg_picture = JpegPicture('file_name.jpg', self.stub_iptc_info,
        self.metadata_dict)
    output_name = jpeg_picture.get_output_file_name()
    self.assertEquals('file_name.html', output_name)

  def test_picture_should_replace_spaces_with_hyphens(self):
    jpeg_picture = JpegPicture('file name.jpg', self.stub_iptc_info,
        self.metadata_dict)
    output_name = jpeg_picture.get_output_file_name()
    self.assertEquals('file-name.html', output_name)

  def test_simple_directory_output_file_name(self):
    jpeg_directory = JpegDirectory('directory', [])
    output_name = jpeg_directory.get_output_file_name()
    self.assertEquals('directory.html', output_name)

  def test_directory_should_replace_spaces_with_hyphens(self):
    jpeg_directory = JpegDirectory('directory name', [])
    output_name = jpeg_directory.get_output_file_name()
    self.assertEquals('directory-name.html', output_name)

  def test_directory_should_replace_slashes_with_hyphens(self):
    jpeg_directory = JpegDirectory('directory/name', [])
    output_name = jpeg_directory.get_output_file_name()
    self.assertEquals('directory-name.html', output_name)

  def test_directory_should_replace_backslashes_with_hyphens(self):
    jpeg_directory = JpegDirectory('directory\\name', [])
    output_name = jpeg_directory.get_output_file_name()
    self.assertEquals('directory-name.html', output_name)

if __name__ == '__main__':
  unittest.main()
