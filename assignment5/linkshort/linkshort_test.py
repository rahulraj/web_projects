import unittest
import tempfile
import os
import __init__ as linkshort

class LinkShortTest(unittest.TestCase):
  def setUp(self):
    self.database_handle, linkshort.app.database = tempfile.mkstemp()
    self.app = linkshort.app.test_client()
    linkshort.initialize_database()

  def test_get_index(self):
    """ Send a get request to /, it should return a template """
    output = self.app.get('/')
    self.assertTrue('Link Shortener' in output.data)

  def tearDown(self):
    os.close(self.database_handle)
    os.unlink(linkshort.app.database)

if __name__ == '__main__':
  unittest.main()
