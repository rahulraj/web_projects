import hashlib
import string
from random import randint
from inject import assign_injectables
from getters import with_getters_for

salt_length = 10

class NoSuchUser(Exception):
  """ Exception indicating we tried to look up a nonexistant user. """
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
    """
    Tell if a user exists.

    Args:
      username the name of the user.

    Returns:
      True if the user is in user_shelf.
    """
    return str(username) in self.user_shelf
  
  def is_valid_user(self, username):
    """
    Tell if a username is valid.

    Args:
      username the name to validate.

    Returns:
      True if the username is not taken, does not have spaces, and is nonempty.
    """
    if self.has_user(username):
      return False
    if len(username) == 0:
      return False
    if ' ' in username:
      return False
    return True

  def register_user(self, username, password):
    """
    Register a user, storing the data in self.user_shelf.
    Unlike certain services who I will not name, this function
    keeps passwords secure by hashing them with salts.

    Args:
      username the name for the user.
      password their password.
    """
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

    Returns:
      True if the user is authentical.
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
    """
    Retrieves the stickies for a user.

    Args:
      username the name of the user.

    Returns:
      A JSON string containing data about the stickies, to be
      interpreted client-side.
    """
    if not self.has_user(username):
      raise NoSuchUser
    user_data = self.user_shelf[str(username)]
    return user_data.get_stickies_json()

  def save_stickies_for_user(self, username, new_stickies_json):
    """
    Save the stickies for a user

    Args:
      username the user's name.
      new_stickies_json the newly updated stickies JSON string.
    """
    if not self.has_user(username):
      raise NoSuchUser
    user_data = self.user_shelf[str(username)]
    self.user_shelf[str(username)] = user_data.update_stickies(new_stickies_json)

class UserData(object):
  """ Class defining the values in the users shelf """
  def __init__(self, hashed_password, salt, stickies_json):
    """
    Constructor for UserData

    Args:
      hashed_password the password after being hashed.
      salt the salt used to hash the password.
      stickies_json the JSON string  for their stickies.
    """
    assign_injectables(self, locals())

  def update_stickies(self, new_stickies_json):
    """ Returns a new UserData with the updated stickies """
    return UserData(self.hashed_password, self.salt, new_stickies_json)
with_getters_for(UserData, 'hashed_password', 'salt', 'stickies_json')

def confirmed_password_valid(password, confirmation):
  """
  Tell if a password was confirmed properly

  Args:
    password the password to check.
    confirmation the confirmation of the password.

  Returns:
    True if the password and confirmation are the same (no typos)
  """
  return password == confirmation

def generate_salt(length):
  """
  Randomly generate a salt.

  Args:
    length the length of the salt.

  Returns:
    A string salt to use in hashing.
  """
  possible_characters = string.ascii_letters + string.digits
  salt = ""
  for _ in range(0, length):
    salt += possible_characters[randint(0, len(possible_characters) - 1)]
  return salt

def combine_password_with_salt(password, salt):
  """
  Combine a password with a salt.

  Args:
    password the password.
    salt the salt.

  Returns:
    A combined string that can be hashed.
  """
  return salt + password

def do_hash(to_hash):
  """
  Compute the hash for the input.

  Args:
    to_hash the string to hash.
  
  Returns:
    A hashed string that can be stored in the database.
  """
  return hashlib.sha512(to_hash).hexdigest()
