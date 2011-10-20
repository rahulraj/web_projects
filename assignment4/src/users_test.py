import unittest
from users import Users, confirmed_password_valid

class UsersTest(unittest.TestCase):
  def setUp(self):
    """ Using dicts instead of Shelve objects to speed up testing. """
    self.users = Users({}, {})

  def test_confirm_passwords(self):
    self.assertTrue(confirmed_password_valid('foo', 'foo'))
    self.assertFalse(confirmed_password_valid('foo', 'bar'))

  def test_simple_add_users(self):
    username = 'test_user'
    password = 'test_password'
    self.assertFalse(self.users.has_user(username))
    self.users.register_user(username, password)
    self.assertTrue(self.users.has_user(username))

if __name__ == '__main__':
  unittest.main()
