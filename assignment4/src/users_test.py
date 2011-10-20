import unittest
from users import Users, confirmed_password_valid

class UsersTest(unittest.TestCase):
  def setUp(self):
    """ Using dicts instead of Shelve objects to speed up testing. """
    self.users = Users({}, {})
    self.username = 'test_user'
    self.password = 'test_password'

  def test_confirm_passwords(self):
    self.assertTrue(confirmed_password_valid('foo', 'foo'))
    self.assertFalse(confirmed_password_valid('foo', 'bar'))

  def test_simple_add_users(self):
    self.assertFalse(self.users.has_user(self.username))
    self.users.register_user(self.username, self.password)
    self.assertTrue(self.users.has_user(self.username))
    self.assertTrue(self.users.login_is_valid(self.username, self.password))

  def test_login_before_register(self):
    self.assertFalse(self.users.login_is_valid(self.username, self.password))

  def test_login_with_wrong_password(self):
    self.users.register_user(self.username, self.password)
    self.assertFalse(self.users.login_is_valid(self.username, 'bad_password'))

if __name__ == '__main__':
  unittest.main()
