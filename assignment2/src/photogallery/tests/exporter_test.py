import unittest
from ..utils.inject import assign_injectables
from ..utils.immutabledict import ImmutableDict
from ..generator.exporter import Exporter

directory_values = ['title', 'images']
picture_values = ['alt_text', 'src', 'caption_data']

class MockJinja2Template(object):
  def __init__(self, required_values):
    assign_injectables(self, locals())

  def render(self, template_arguments):
    for argument in template_arguments:
      assert (argument in self.required_values)

class StubJpegPicture(object):
  def __init__(self, alt_text, src, caption_data):
    assign_injectables(self, locals())

  def get_contents(self):
    return []

  def as_view(self):
    return ImmutableDict.of(alt_text=self.alt_text, src=self.src,
        caption_data=self.caption_data)

  def get_exporter(self):
    return Exporter(MockJinja2Template(picture_values))

  def get_name(self):
    return self.src

  def get_output_file_name(self):
    return self.src

class StubJpegDirectory(object):
  def __init__(self, title, images):
    assign_injectables(self, locals())

  def get_contents(self):
    return self.images

  def as_view(self):
    return ImmutableDict.of(title=self.title, images=self.images)

  def get_exporter(self):
    return Exporter(MockJinja2Template(directory_values))

  def get_name(self):
    return self.title

  def get_output_file_name(self):
    return self.title

class SimpleExporterTest(unittest.TestCase):
  def setUp(self):
    self.mock_template = MockJinja2Template(picture_values)
    self.picture = StubJpegPicture('a picture', 'picture1.jpg', 'Caption')
    self.exporter = Exporter(self.mock_template)

  def test_it_should_populate_the_jinja2_template(self):
    self.exporter.export(self.picture)

class DirectoryExporterTest(unittest.TestCase):
  def setUp(self):
    self.pictures_in_dir = [
        StubJpegPicture('first picture', 'picture1.jpg', 'Caption1'),
        StubJpegPicture('second picture', 'picture2.jpg', 'Caption2')]
    self.stub_directory = StubJpegDirectory('My Pictures', self.pictures_in_dir)
    self.mock_template = MockJinja2Template(directory_values)
    self.exporter = Exporter(self.mock_template)

  def test_it_should_populate_the_jinja2_template(self):
    self.exporter.export(self.stub_directory)

if __name__ == '__main__':
  unittest.main()
