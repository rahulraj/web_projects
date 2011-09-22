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

class StubJpegPicture(object):
  def __init__(self, alt_text, src, caption_data):
    assign_injectables(self, locals())

  def get_contents(self):
    return []

  def as_view(self):
    return ImmutableDict.of(alt_text=self.alt_text, src=self.src,
        caption_data=self.caption_data)

class ExporterTest(unittest.TestCase):
  def setUp(self):
    self.required_values = ['alt_text', 'src', 'caption_data']
    self.mock_template = MockJinja2Template(self.required_values)
    self.picture = StubJpegPicture('a picture', 'picture1.jpg', 'Caption')
    self.exporter = Exporter(self.mock_template)

  def test_it_should_populate_the_jinja2_template(self):
    self.exporter.export(self.picture)

if __name__ == '__main__':
  unittest.main()
