import unittest
from ..utils.inject import assign_injectables
from ..generator.jpegdirectoryexporter import JpegDirectoryExporter
from ..generator.galleryitem import JpegDirectoryView, JpegPictureView

class MockJinja2Template(object):
  def __init__(self, required_values):
    assign_injectables(self, locals())

  def render(self, template_arguments):
    for argument in template_arguments:
      assert (argument in self.required_values)

class JpegDirectoryExporterTest(unittest.TestCase):
  def setUp(self):
    self.required_values = ['title', 'images']
    self.mock_template = MockJinja2Template(self.required_values)
    picture = JpegPictureView('a picture',
        'picture1.jpg', 'Taken with my new camera')
    self.images = [picture]
    self.directory_view = JpegDirectoryView('My Pictures', self.images)
    self.exporter = JpegDirectoryExporter(self.mock_template)

  def test_it_should_populate_the_jinja2_template(self):
    self.exporter.export_directory(self.directory_view)

if __name__ == '__main__':
  unittest.main()
