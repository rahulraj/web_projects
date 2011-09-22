import unittest
from ..utils.inject import assign_injectables
from ..utils.immutabledict import ImmutableDict
from ..generator.exporter import Exporter

class MockJinja2Template(object):
  def __init__(self, required_values):
    assign_injectables(self, locals())

  def render(self, template_arguments):
    for argument in template_arguments:
      assert (argument in self.required_values)

class ExporterTest(unittest.TestCase):
  def setUp(self):
    self.required_values = ['title', 'images']
    self.mock_template = MockJinja2Template(self.required_values)
    picture = ImmutableDict.of(title='a picture', src='picture1.jpg',
        caption_data='Taken with my new camera')
    self.images = [picture]
    self.directory_view = ImmutableDict.of(title='My Pictures',
        images=self.images)
    self.exporter = Exporter(self.mock_template)

  def test_it_should_populate_the_jinja2_template(self):
    self.exporter.export(self.directory_view)

if __name__ == '__main__':
  unittest.main()
