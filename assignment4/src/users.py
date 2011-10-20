import hashlib
import string
from random import randint

salt_length = 10

class Users(object):
  def __init__(self, user_shelf, salt_shelf):
    """
    Create a Users object.

    Args:
      user_shelf a Shelve object obtained from opening the 'users' file.
          Maps usernames to their hashed passwords.
      salt_shelf a Shelve object from the 'salts' file, maps usernames to
          the salts used to hash their passwords.
    """
    self.user_shelf = user_shelf
    self.salt_shelf = salt_shelf

  def has_user(self, username):
    return username in self.user_shelf

  def register_user(self, username, password):
    salt = generate_salt(salt_length)
    to_hash = combine_password_with_salt(password, salt)
    hashed = do_hash(to_hash)
    self.user_shelf[username] = hashed
    self.salt_shelf[username] = salt

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
    users_salt = self.salt_shelf[username]
    to_hash = combine_password_with_salt(password, users_salt)
    proposed_hash = do_hash(to_hash)
    real_hash = self.user_shelf[username]
    return proposed_hash == real_hash

def confirmed_password_valid(password, confirmation):
  return password == confirmation

def generate_salt(length):
  possible_characters = string.ascii_letters + string.digits
  salt = ""
  for _ in range(0, length):
    salt += possible_characters[randint(0, len(possible_characters))]
  return salt

def combine_password_with_salt(password, salt):
  return salt + password

def do_hash(to_hash):
  return hashlib.sha512(to_hash).hexdigest()
