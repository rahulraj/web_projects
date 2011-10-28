import hashlib
import string
from random import randint
from inject import assign_injectables
from databaseservice import User

salt_length = 10

class NoSuchUser(Exception):
  """ Exception indicating we tried to look up a nonexistant user. """
  pass

class Users(object):
  def __init__(self, database_service):
    """
    Create a Users object.

    Args:
      database_service the service object that talks to the database.
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
    return self.database_service.has_user_with_name(username)
  
  def is_valid_username(self, username):
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
    Register a user, storing the data in self.database_service
    Unlike certain services who I will not name, this function
    keeps passwords secure by hashing them with salts.

    Args:
      username the name for the user.
      password their password.

    Returns:
      The User object returned by the database service, which
      contains the fields in the table.
    """
    salt = generate_salt(salt_length)
    to_hash = combine_password_with_salt(password, salt)
    hashed = do_hash(to_hash)
    user = User(username, hashed, salt)
    return self.database_service.add_user(user)

  def try_login_user(self, username, password):
    """
    Returns the User if the user under username's password
    matches the given pasword.

    Args:
      username the username
      password the submitted password

    Returns:
      The logged in User, or None for a failure.
    """
    if not self.has_user(username):
      return False
    user_data = self.database_service.find_user_by_name(username)
    users_salt = user_data.get_salt()
    to_hash = combine_password_with_salt(password, users_salt)
    proposed_hash = do_hash(to_hash)
    real_hash = user_data.get_hashed_password()
    if proposed_hash == real_hash:
      return user_data
    else:
      return None

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
