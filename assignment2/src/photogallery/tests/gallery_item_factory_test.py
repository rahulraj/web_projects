import unittest
from ..generator.galleryitemfactory import GalleryItemFactory
from ..utils.inject import assign_injectables

class SimpleStubOsModule(object):
  def __init__(self, stub_list):
    assign_injectables(self, locals()) 

  def listdir(self, path):
    return self.stub_list
    
    #return ['6170_sample_image_01.jpg', '6170_sample_image_02.jpg'] 
class GalleryItemFactoryTest(unittest.TestCase):
  def test_it_should_create_JpegPictures_for_all_jpg_files(self):
    images = ['6170_sample_image_01.jpg', '6170_sample_image_02.jpg'] 
    factory = GalleryItemFactory(None, None,
        file_finder=SimpleStubOsModule(images))
    jpeg_directory = factory.create_directory('/not/real')
    jpeg_pictures = jpeg_directory.get_contents()
    for picture in jpeg_pictures:
      self.assertTrue(picture.get_file_name() in images)
