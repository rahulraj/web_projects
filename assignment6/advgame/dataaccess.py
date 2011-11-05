from functools import partial
from inject import assign_injectables
from getters import with_getters_for

""" Data access objects, representing rows in the database tables.  """
class NoneId(Exception):
  pass

def get_id_if_not_none(self):
  """ 
  Modified ID getter function that raises an Exception instead of
  silently returning None if called on an object not yet in the database.
  """
  if self.id is None:
    raise NoneId
  return self.id

class DatabaseObject(object):
  def __init__(self):
    self.get_id = partial(get_id_if_not_none, self)
    super(DatabaseObject, self).__init__()

class User(DatabaseObject):
  def __init__(self, username, hashed_password, salt, id=None):
    assign_injectables(self, locals())
    super(User, self).__init__()

  @classmethod
  def from_row(clazz, row):
    (id, username, hashed_password, salt) = row
    return clazz(username, hashed_password, salt, id=id)
with_getters_for(User, 'username', 'hashed_password', 'salt')

class Player(DatabaseObject):
  def __init__(self, created_by_user, currently_in_room, id=None):
    assign_injectables(self, locals())
    super(Player, self).__init__()

  @classmethod
  def from_row(clazz, row):
    (id, created_by_user, currently_in_room) = row
    return clazz(created_by_user, currently_in_room, id=id)
with_getters_for(Player, 'created_by_user', 'currently_in_room')

class GameEntity(DatabaseObject):
  """
  Abstract base class for objects in the game with names and descriptions
  """
  def __init__(self):
    super(GameEntity, self).__init__()
with_getters_for(GameEntity, 'name', 'description')

class Room(GameEntity):
  def __init__(self, name, description, id=None):
    assign_injectables(self, locals())
    super(Room, self).__init__()

  @classmethod
  def from_row(clazz, row):
    (id, name, description) = row
    return clazz(name, description, id=id)
# GameEntity already implements all the necessary getters

class Exit(GameEntity):
  def __init__(self, name, description, from_room, to_room, locked, id=None):
    assign_injectables(self, locals())
    super(Exit, self).__init__()

  def is_locked(self):
    """
    Getter for locked; with_getters_for would call the function
    get_locked which is less natural-sounding for a boolean.
    """
    return self.locked

  @classmethod
  def from_row(clazz, row):
    (id, name, description, from_room, to_room, locked) = row
    return clazz(name, description, from_room, to_room, locked, id=id)
with_getters_for(Exit, 'from_room', 'to_room')

class Item(GameEntity):
  """
  Abstract base class for objects which players can add to their inventory.
  """
  def __init__(self):
    super(Item, self).__init__()

  def is_locked(self):
    """
    An Item is locked if the player can not pick it up without
    doing some other action first.
    """
    return self.locked
with_getters_for(Item, 'use_message', 'owned_by_player', 'in_room')

class ItemUnlockingItem(Item):
  def __init__(self, name,  description, use_message,
      owned_by_player, in_room, locked, unlocks_item, id=None):
    assign_injectables(self, locals())
    super(ItemUnlockingItem, self).__init__()

  @classmethod
  def from_row(clazz, row):
    (id, name, description, use_message, owned_by_player,
        in_room, locked, unlocks_item) = row
    return clazz(name, description, use_message, owned_by_player,
        in_room, locked, unlocks_item, id=id)
with_getters_for(ItemUnlockingItem, 'unlocks_item')

class ExitUnlockingItem(Item):
  def __init__(self, name, description, use_message,
      owned_by_player, in_room, locked, unlocks_exit, id=None):
    assign_injectables(self, locals())
    super(ExitUnlockingItem, self).__init__()

  @classmethod
  def from_row(clazz, row):
    (id, name, description, use_message, owned_by_player,
        in_room, locked, unlocks_exit) = row
    return clazz(name, description, use_message, owned_by_player,
        in_room, locked, unlocks_exit, id=id)
with_getters_for(ExitUnlockingItem, 'unlocks_exit')
