import hashlib
import string
from random import randint
from inject import assign_injectables
from getters import with_getters_for

salt_length = 10

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
    return username in self.user_shelf

  def register_user(self, username, password):
    salt = generate_salt(salt_length)
    to_hash = combine_password_with_salt(password, salt)
    hashed = do_hash(to_hash)
    user_data = UserData(hashed, salt)
    self.user_shelf[username] = user_data

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
    user_data = self.user_shelf[username]
    users_salt = user_data.get_salt()
    to_hash = combine_password_with_salt(password, users_salt)
    proposed_hash = do_hash(to_hash)
    real_hash = user_data.get_hashed_password()
    return proposed_hash == real_hash

class UserData(object):
  """ Class defining the values in the users shelf """
  def __init__(self, hashed_password, salt):
    assign_injectables(self, locals())
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
