import hashlib
import string
from random import randint
from inject import assign_injectables
from getters import with_getters_for

salt_length = 10

class NoSuchUser(Exception):
  pass

class Users(object):
  def __init__(self, user_shelf):
    """
    Create a Users object.

    Args:
      user_shelf a Shelve object obtained from opening the 'users' file.
          Maps usernames to their hashed passwords.
    """
    assign_injectables(self, locals())

  def has_user(self, username):
    return str(username) in self.user_shelf
  
  def is_valid_user(self, username):
    if self.has_user(username):
      return False
    if len(username) == 0:
      return False
    if ' ' in username:
      return False
    return True

  def register_user(self, username, password):
    salt = generate_salt(salt_length)
    to_hash = combine_password_with_salt(password, salt)
    hashed = do_hash(to_hash)
    user_data = UserData(hashed, salt, '{"notes": []}')
    self.user_shelf[str(username)] = user_data

  def login_is_valid(self, username, password):
    """
    Returns true if the user under username's password
    matches the given pasword, false otherwise.

    Args:
      username the username
      password the submitted password
    """
    if not self.has_user(username):
      return False
    user_data = self.user_shelf[str(username)]
    users_salt = user_data.get_salt()
    to_hash = combine_password_with_salt(password, users_salt)
    proposed_hash = do_hash(to_hash)
    real_hash = user_data.get_hashed_password()
    return proposed_hash == real_hash

  def stickies_for_user(self, username):
    if not self.has_user(username):
      raise NoSuchUser
    user_data = self.user_shelf[str(username)]
    return user_data.get_stickies_json()

  def save_stickies_for_user(self, username, new_stickies_json):
    if not self.has_user(username):
      raise NoSuchUser
    user_data = self.user_shelf[str(username)]
    self.user_shelf[str(username)] = user_data.update_stickies(new_stickies_json)

class UserData(object):
  """ Class defining the values in the users shelf """
  def __init__(self, hashed_password, salt, stickies_json):
    self.hashed_password = hashed_password
    self.salt = salt
    self.stickies_json = stickies_json

  def get_stickies_json(self):
    return self.stickies_json

  def update_stickies(self, new_stickies_json):
    """ Returns a new UserData with the updated stickies """
    return UserData(self.hashed_password, self.salt, new_stickies_json)
with_getters_for(UserData, 'hashed_password', 'salt')

def confirmed_password_valid(password, confirmation):
  return password == confirmation

def generate_salt(length):
  possible_characters = string.ascii_letters + string.digits
  salt = ""
  for _ in range(0, length):
    salt += possible_characters[randint(0, len(possible_characters) - 1)]
  return salt

def combine_password_with_salt(password, salt):
  return salt + password

def do_hash(to_hash):
  return hashlib.sha512(to_hash).hexdigest()
