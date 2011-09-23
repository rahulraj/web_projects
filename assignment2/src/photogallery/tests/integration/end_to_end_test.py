import unittest
import os.path
import shutil
from copier_test import create_directory
from ...generator.gallerygenerator import create_gallery_generator

class EndToEndTest(unittest.TestCase):
  """
  This test case runs the application from start to end.
  """
  def setUp(self):
    # TODO get some actual jpeg files
    create_directory('/tmp/fromdir')
    create_directory('/tmp/fromdir/first_sub')
    create_directory('/tmp/todir')
    with open('/tmp/fromdir/foo.jpg', 'w') as first_jpg:
      first_jpg.write('some jpeg data')
    with open('/tmp/fromdir/bar.jpg', 'w') as second_jpg:
      second_jpg.write('some more jpeg data')
    with open('/tmp/fromdir/first_sub/baz.jpg', 'w') as third_jpg:
      third_jpg.write('even more jpeg data')
    with open('/tmp/fromdir/manifest.json', 'w') as json_file:
      json_file.write('{}')

  def disabled_test_it_should_create_html_files(self):
    """
    This test needs actual JPEGs, not text files pretending to be.
    """
    return
    command_line_arguments = ['-i', '/tmp/fromdir', '-o', '/tmp/todir',
        '-m', '/tmp/fromdir/manifest.json']
    generator = create_gallery_generator(command_line_arguments)
    generator.run()
    self.assertTrue(os.path.isfile('/tmp/todir/foo.html'))
    self.assertTrue(os.path.isfile('/tmp/todir/bar.html'))
    self.assertTrue(os.path.isfile('/tmp/todir/tmp.html'))
    self.assertTrue(os.path.isfile('/tmp/todir/tmp-fromdir-first_sub.html'))
    self.assertTrue(os.path.isfile('/tmp/todir/baz.html'))

  def tearDown(self):
    shutil.rmtree('/tmp/fromdir')
    shutil.rmtree('/tmp/todir')
