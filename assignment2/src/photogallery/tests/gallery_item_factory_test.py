import unittest
from ..generator.galleryitemfactory import GalleryItemFactory
from ..generator.galleryitem import JpegDirectory
from ..utils.inject import assign_injectables

class SimpleStubOsModule(object):
  def __init__(self, stub_list):
    assign_injectables(self, locals()) 

  def listdir(self, path):
    if path == '/not/real':
      return self.stub_list
    else:
      return []


class GalleryItemFactoryTest(unittest.TestCase):
  def setUp(self):
    self.files = ['6170_sample_image_01.jpg', '6170_sample_image_02.jpg'] 
    self.directory_names = ['jpeg_subdirectory']
    self.files.extend(self.directory_names)

    def is_directory(name):
      return name in self.directory_names

    self.file_finder = SimpleStubOsModule(self.files)
    self.factory = GalleryItemFactory(None, None,
        file_finder=self.file_finder, is_directory=is_directory)

  def test_it_should_create_JpegPictures_for_all_jpg_files(self):
    #import ipdb; ipdb.set_trace()
    jpeg_directory = self.factory.create_directory('/not/real')
    entries = jpeg_directory.get_contents()
    for picture in entries:
      self.assertTrue(picture.get_name() in self.files)

  def test_it_should_ignore_non_jpeg_files(self):
    self.files.append('not_a_jpeg.txt')
    jpeg_directory = self.factory.create_directory('/not/real')
    entries = jpeg_directory.get_contents()
    entry_filenames = [entry.get_name() for entry in entries]
    self.assertTrue('not_a_jpeg.txt' not in entry_filenames)

  def test_it_should_create_JpegDirectories_for_all_directories(self):
    jpeg_directory = self.factory.create_directory('/not/real')
    contents = jpeg_directory.get_contents()
    directory = [entry for entry in contents if isinstance(entry, JpegDirectory)]

    self.assertEquals(1, len(directory))
    self.assertEquals(self.directory_names[0], directory[0].get_name())

if __name__ == '__main__':
  unittest.main()
