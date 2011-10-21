import unittest
import main

class MainTest(unittest.TestCase):
  def setUp(self):
    self.app = main.app.test_client()

  def test_get_index(self):
    """ 
    Make sure that the application doesn't fail when asked
    to retrieve the index, as a sanity check.
    """
    self.app.get('/')     

  def test_get_login(self):
    self.app.get('/login')

  def test_get_register(self):
    self.app.get('/register')

if __name__ == '__main__':
  unittest.main()
