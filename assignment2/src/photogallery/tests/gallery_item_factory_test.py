import unittest
from ..generator.galleryitemfactory import GalleryItemFactory
from ..generator.galleryitem import JpegDirectory, JpegPicture
from ..utils.inject import assign_injectables

class SimpleStubOsModule(object):
  def __init__(self, stub_list):
    assign_injectables(self, locals()) 

  def listdir(self, path):
    if path == '/not/real':
      return self.stub_list
    else:
      return []


class StubIptcInfoConstructor(object):
  def __init__(self, file_name):
    pass


class GalleryItemFactoryTest(unittest.TestCase):
  def setUp(self):
    self.top_directory = '/not/real'
    self.files = ['/not/real/6170_sample_image_01.jpg',
        '/not/real/6170_sample_image_02.jpg'] 
    self.directory_names = ['/not/real/jpeg_subdirectory']
    self.files.extend(self.directory_names)

    def is_directory(name):
      """
      Returns true if name ends with something in self.directory_names 
      to allow for fully qualified paths.
      """
      for directory_name in self.directory_names:
        if name.endswith(directory_name):
          return True
      return False

    self.file_finder = SimpleStubOsModule(self.files)
    self.factory = GalleryItemFactory(lookup_table=None, should_prompt=False,
        iptc_info_constructor=StubIptcInfoConstructor,
        file_finder=self.file_finder, is_directory=is_directory)

  def test_it_should_create_JpegPictures_for_all_jpg_files(self):
    jpeg_directory = self.factory.create_directory(self.top_directory)
    entries = jpeg_directory.get_contents()
    for picture in entries:
      self.assertTrue(picture.get_name() in self.files)

  def test_it_should_ignore_non_jpeg_files(self):
    self.files.append('not_a_jpeg.txt')
    jpeg_directory = self.factory.create_directory(self.top_directory)
    entries = jpeg_directory.get_contents()
    entry_filenames = [entry.get_name() for entry in entries]
    self.assertTrue('not_a_jpeg.txt' not in entry_filenames)

  def test_it_should_create_JpegDirectories_for_all_directories(self):
    jpeg_directory = self.factory.create_directory(self.top_directory)
    contents = jpeg_directory.get_contents()
    directory = [entry for entry in contents if isinstance(entry, JpegDirectory)]

    self.assertEquals(1, len(directory))
    self.assertTrue(directory[0].get_name().endswith(self.directory_names[0]))


class NestedDirectoryOsModule(object):
  def __init__(self, first_list, second_list):
    assign_injectables(self, locals())

  def listdir(self, path):
    if path == '/first':
      return self.first_list
    elif path == '/first/second':
      return self.second_list
    else:
      return []


class NestedDirectoryGalleryItemFactoryTest(unittest.TestCase):
  def setUp(self):
    self.top_directory = '/first'
    self.files_in_first = ['6170_sample_image_01.jpg', '6170_sample_image_02.jpg',
        'second'] 
    self.files_in_second = ['a_jpeg.jpg', 'another_jpeg.jpg']
    def is_directory(name):
      return name == '/first' or name == '/first/second'
    self.is_directory = is_directory
    self.file_finder = NestedDirectoryOsModule(self.files_in_first,
        self.files_in_second)
    self.factory = GalleryItemFactory(lookup_table={}, should_prompt=False,
        iptc_info_constructor=StubIptcInfoConstructor,
        file_finder=self.file_finder, is_directory=self.is_directory)

  def test_it_should_create_GalleryItems_in_nested_directories(self):
    first_directory = self.factory.create_directory(self.top_directory)
    contents = first_directory.get_contents()
    jpeg_names_in_first = [jpeg.get_name() for jpeg in contents \
        if isinstance(jpeg, JpegPicture)]
    self.assertTrue('6170_sample_image_01.jpg' in jpeg_names_in_first) 
    self.assertTrue('6170_sample_image_02.jpg' in jpeg_names_in_first) 

    directories_in_first = [directory for directory in contents \
        if isinstance(directory, JpegDirectory)]
    self.assertEquals(1, len(directories_in_first))
    second_directory = directories_in_first[0]
    self.assertEquals('/first/second', second_directory.get_name())

    second_contents = second_directory.get_contents()
    jpeg_names_in_second = [jpeg.get_name() for jpeg in second_contents \
        if isinstance(jpeg, JpegPicture)]
    self.assertTrue('a_jpeg.jpg' in jpeg_names_in_second)
    self.assertTrue('another_jpeg.jpg' in jpeg_names_in_second)

    directories_in_second = [directory for directory in second_contents \
        if isinstance(directory, JpegDirectory)]
    self.assertEquals(0, len(directories_in_second))

  def test_nested_directories_should_remember_their_parents(self):
    first_directory = self.factory.create_directory(self.top_directory)
    contents = first_directory.get_contents()
    second_directory = [directory for directory in contents \
        if isinstance(directory, JpegDirectory)]
    self.assertEquals(1, len(second_directory))
    directory = second_directory[0]
    view = directory.as_view()
    self.assertTrue('back_href' in view)
    self.assertTrue('first' in view['back_href'])
    self.assertTrue('.html' in view['back_href'])

if __name__ == '__main__':
  unittest.main()
