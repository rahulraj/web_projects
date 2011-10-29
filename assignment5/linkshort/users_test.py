import unittest
from users import Users, confirmed_password_valid
from databaseservice import User, NoSuchUser

class FakeDatabaseService(object):
  def __init__(self):
    self.user_data = {}
    self.row_counter = 0

  def add_user(self, user):
    username = user.get_username()
    added_user = User(username, user.get_hashed_password(),
        user.get_salt(), id=self.row_counter)
    self.user_data[username] = added_user
    self.row_counter += 1
    return added_user

  def has_user_with_name(self, username):
    return username in self.user_data

  def find_user_by_name(self, username):
    if username not in self.user_data:
      raise NoSuchUser
    return self.user_data[username]

class UsersTest(unittest.TestCase):
  def setUp(self):
    """ Using dicts instead of Shelve objects to speed up testing. """
    self.fake_database = FakeDatabaseService()
    self.users = Users(self.fake_database)
    self.username = 'test_user'
    self.password = 'test_password'

  def test_confirm_passwords(self):
    self.assertTrue(confirmed_password_valid('foo', 'foo'))
    self.assertFalse(confirmed_password_valid('foo', 'bar'))

  def test_simple_add_users(self):
    self.assertFalse(self.users.has_user(self.username))
    self.users.register_user(self.username, self.password)
    self.assertTrue(self.users.has_user(self.username))
    self.assertTrue( \
        self.users.try_login_user(self.username, self.password) is not None)

  def test_login_before_register(self):
    self.assertTrue( \
        self.users.try_login_user(self.username, self.password) is None)

  def test_login_with_wrong_password(self):
    self.users.register_user(self.username, self.password)
    self.assertTrue( \
        self.users.try_login_user(self.username, 'bad_password') is None)

if __name__ == '__main__':
  unittest.main()
