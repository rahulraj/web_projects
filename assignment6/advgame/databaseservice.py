import sqlite3
from contextlib import closing
from inject import assign_injectables
from getters import with_getters_for

def connect_database(database_file):
  """
  Connect to a database

  Args:
    database_file the file containing the sqlite3 data.
  """
  return sqlite3.connect(database_file)

def initialize_database(database_file, schema):
  """
  Initialize a database

  Args:
    database_file the file to put the database
    schema the file containing the database schema
  """
  with closing(connect_database(database_file)) as database:
    database.cursor().executescript(schema.read())
    database.commit()

class NoSuchUser(Exception):
  """ The user requested does not exist. """
  pass

class DatabaseService(object):
  def __init__(self, connection, cursor):
    assign_injectables(self, locals())

  def add_user(self, user):
    """
    Ignores the ID attribute of user, allowing the database to create
    a new autoincrement ID. Use the returned User to make calls to find_*

    Args:
      user a User object containing the row data (except for the ID)

    Returns:
      A new User object with the ID field filled in.
    """
    # Pass in null for the ID; sqlite will automatically generate an ID.
    self.cursor.execute( \
        'insert into users values (null, :username, :hashed_password, :salt)',
        {'username': user.get_username(), 
         'hashed_password': user.get_hashed_password(),
         'salt': user.get_salt()})
    self.connection.commit()
    return User(user.get_username(), user.get_hashed_password(),
        user.get_salt(), id=self.cursor.lastrowid)

  def user_query(self, username):
    """
    Helper method to query for a user

    Args:
      username the name of the user

    Returns:
      The row with that username.
    """
    self.cursor.execute( \
        'select * from users where username=:username',
        {'username': username})
    return self.cursor.fetchone()

  def has_user_with_name(self, username):
    """
    Tell if a user exists

    Args:
     username the user name to check.

    Returns:
      True if that username is in the database.
    """
    row = self.user_query(username) 
    return row is not None

  def find_user_by_name(self, username):
    """
    Finds the user with username

    Args:
      username the name for the user.

    Returns:
      The User for that username.

    Raises:
      NoSuchUser if the user does not exist.
    """
    row = self.user_query(username)
    if row is None:
      raise NoSuchUser
    return User(row[1], row[2], row[3], id=row[0])

""" Data access objects, representing rows in the database tables.  """
class User(object):
  def __init__(self, username, hashed_password, salt, id=None):
    assign_injectables(self, locals())
with_getters_for(User, 'id', 'username', 'hashed_password', 'salt')

class Player(object):
  def __init__(self, created_by_user, currently_in_room, id=None):
    assign_injectables(self, locals())
with_getters_for(Player, 'id', 'created_by_user', 'currently_in_room')

class GameEntity(object):
  """
  Abstract base class for objects in the game with names and descriptions
  """
  pass
with_getters_for(GameEntity, 'id', 'name', 'description')

class Room(GameEntity):
  def __init__(self, name, description, id=None):
    assign_injectables(self, locals())
# GameEntity already implements all the necessary getters

class Exit(GameEntity):
  def __init__(self, name, description, from_room, to_room, locked, id=None):
    assign_injectables(self, locals())

  def is_locked(self):
    """
    Getter for locked; with_getters_for would call the function
    get_locked which is less natural-sounding for a boolean.
    """
    return self.locked
with_getters_for(Exit, 'from_room', 'to_room')

class Item(GameEntity):
  """
  Abstract base class for objects which players can add to their inventory.
  """
  pass
with_getters_for(Item, 'id', 'owned_by_player')

class ItemUnlockingItem(Item):
  def __init__(self, name,  description,
      owned_by_player, unlocks_item, id=None):
    assign_injectables(self, locals())
with_getters_for(ItemUnlockingItem, 'unlocks_item')

class ExitUnlockingItem(Item):
  def __init__(self, name, description,
      owned_by_player, unlocks_exit, id=None):
    assign_injectables(self, locals())
with_getters_for(ExitUnlockingItem, 'unlocks_exit')
