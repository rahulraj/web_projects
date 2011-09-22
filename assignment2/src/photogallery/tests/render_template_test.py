import unittest
from jinja2 import Environment, PackageLoader
# Example of how to import from other parts of the package
#from ..renderers import renderer

class Jinja2EnvironmentTest(unittest.TestCase):
  """ 
  Test that Environment is set up properly with respect to
  this package's layout. Somewhat trivial, but it was useful
  when I was setting everything up.
  """
  def setUp(self):
    self.environment = Environment(loader=PackageLoader('photogallery',
      'templates'))

  def test_environment_should_find_the_photo_list_template(self):
    """ 
    Get the template for the photo list. This should not throw TemplateNotFound.
    """
    self.environment.get_template('photo-directory.html')

if __name__ == '__main__':
  unittest.main()
