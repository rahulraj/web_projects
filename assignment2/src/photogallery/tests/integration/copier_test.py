import unittest
import os
import os.path
import shutil
from ...generator import copier

def create_directory(name):
  if not os.path.isdir(name):
    os.makedirs(name)

class TestCopier(unittest.TestCase):
  """
  This test hits the filesystem to test copier.py, and as is,
  will only work on Unixy systems.
  """
  def setUp(self):
    create_directory('/tmp/first')
    create_directory('/tmp/second')
    create_directory('/tmp/first/first_sub')
    with open('/tmp/first/foo.jpg', 'w') as first_jpg:
      first_jpg.write('some jpeg data')
    with open('/tmp/first/bar.jpg', 'w') as second_jpg:
      second_jpg.write('some more jpeg data')
    with open('/tmp/first/first_sub/baz.jpg', 'w') as third_jpg:
      third_jpg.write('even more jpeg data')

  def test_copier_should_copy_the_jpegs(self):
    copier.copy_jpegs('/tmp/first', '/tmp/second')
    self.assertTrue(os.path.isfile('/tmp/second/foo.jpg'))
    self.assertTrue(os.path.isfile('/tmp/second/bar.jpg'))
    self.assertTrue(os.path.isfile('/tmp/second/baz.jpg'))

  def tearDown(self):
    shutil.rmtree('/tmp/first')
    shutil.rmtree('/tmp/second')

if __name__ == '__main__':
  unittest.main()
