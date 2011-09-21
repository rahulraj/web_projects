import unittest
from ..generator.galleryitem import JpegPicture
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
    self.assertEquals('Daniel Jackson', self.jpeg_picture.lookup('Photographer'))
    self.assertEquals('Jerusalem', self.jpeg_picture.lookup('City'))
    self.assertEquals('Israel', self.jpeg_picture.lookup('Country'))
    self.assertEquals('Hike in Ein Kerem', self.jpeg_picture.lookup('Caption'))

if __name__ == '__main__':
  unittest.main()
