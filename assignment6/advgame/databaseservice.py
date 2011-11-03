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
