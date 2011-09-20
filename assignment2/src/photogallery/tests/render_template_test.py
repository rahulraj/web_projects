import unittest
from jinja2 import Environment, PackageLoader
from ..renderers import renderer

class RenderTemplateTest(unittest.TestCase):
  def setUp(self):
    self.environment = Environment(loader=PackageLoader('photogallery',
      'templates'))

  def test_it_should_render_photo_list_given_valid_data(self):
    template = self.environment.get_template('photo-list.html')
    print str(template)

if __name__ == '__main__':
  unittest.main()
