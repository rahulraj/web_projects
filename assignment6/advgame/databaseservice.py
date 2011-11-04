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

  def add_room(self, room):
    self.cursor.execute( \
        'insert into rooms values (null, :name, :description)',
        {'name': room.get_name(), 'description': room.get_description()})
    self.connection.commit()
    return Room(room.get_name(), room.get_description(),
        id=self.cursor.lastrowid)

  def find_room_by_name(self, room_name):
    """ TODO Replace, there could be multiple rooms with the
    same name, in multiple instances of the game. """
    self.cursor.execute( \
        'select * from rooms where name=:name',
        {'name': room_name})
    row = self.cursor.fetchone()
    return Room(row[1], row[2], id=row[0])

  def add_exit(self, exit):
    self.cursor.execute( \
        """
        insert into exits values (null, :name, :description, :from_room,
            :to_room, :locked)
        """,
        {'name': exit.get_name(), 'description': exit.get_description(),
         'from_room': exit.get_from_room(), 'to_room': exit.get_to_room(),
         'locked': exit.is_locked()})
    self.connection.commit()
    return Exit(exit.get_name(), exit.get_description(), exit.get_from_room(),
        exit.get_to_room(), exit.is_locked(), id=self.cursor.lastrowid)

  def find_exits_from_room_with_id(self, room_id):
    self.cursor.execute( \
        """    
        select id, name, description, from_room, to_room, locked 
        from exits where from_room=:room_id order by id
        """, {'room_id': room_id})
    def exit_from_row(row):
      (id, name, description, from_room, to_room, locked) = row
      return Exit(name, description, from_room, to_room, locked, id=id)
    exits_rows = self.cursor.fetchall()
    return map(exit_from_row, exits_rows)

  def add_player(self, player):
    self.cursor.execute( \
        """
        insert into players values
            (null, :created_by_user, :currently_in_room)
        """, 
        {'created_by_user': player.get_created_by_user(),
         'currently_in_room': player.get_currently_in_room()})
    return Player(player.get_created_by_user(), player.get_currently_in_room(),
        id=self.cursor.lastrowid)

  def add_item_unlocking_item(self, item):
    self.cursor.execute( \
        """
        insert into item_unlocking_items values (null, :name, :description,
            :use_message, :owned_by_player, :in_room, :locked, :unlocks_item)
        """,
        {'name': item.get_name(), 'description': item.get_description(),
         'use_message': item.get_use_message(),
         'owned_by_player': item.get_owned_by_player(),
         'in_room': item.get_in_room(), 'locked': item.is_locked(),
         'unlocks_item': item.get_unlocks_item()})
    return ItemUnlockingItem(item.get_name(), item.get_description(),
        item.get_use_message(),
        item.get_owned_by_player(), item.get_in_room(), item.is_locked(),
        item.get_unlocks_item(), id=self.cursor.lastrowid)

  def add_exit_unlocking_item(self, item):
    self.cursor.execute( \
        """
        insert into exit_unlocking_items values (null, :name, :description,
            :use_message, :owned_by_player, :in_room, :locked, :unlocks_exit)
        """,
        {'name': item.get_name(), 'description': item.get_description(),
         'use_message': item.get_use_message(),
         'owned_by_player': item.get_owned_by_player(),
         'in_room': item.get_in_room(), 'locked': item.is_locked(),
         'unlocks_exit': item.get_unlocks_exit()})
    return ExitUnlockingItem(item.get_name(), item.get_description(),
        item.get_use_message(),
        item.get_owned_by_player(), item.get_in_room(), item.is_locked(),
        item.get_unlocks_exit(), id=self.cursor.lastrowid)

  def find_unlocked_items_in_room_with_id(self, room_id):
    self.cursor.execute( \
        """
        select * from item_unlocking_items
        where in_room=:room_id and not locked order by id
        """, {'room_id': room_id})
    def item_unlocking_item_from_row(row):
      (id, name, description, use_message, owned_by_player,
          in_room, locked, unlocks_item) = row
      return ItemUnlockingItem(name, description, use_message, owned_by_player,
          in_room, locked, unlocks_item, id=id)
    items = map(item_unlocking_item_from_row, self.cursor.fetchall())

    self.cursor.execute( \
        """
        select * from exit_unlocking_items
        where in_room=:room_id and not locked order by id
        """, {'room_id': room_id})
    def exit_unlocking_item_from_row(row):
      (id, name, description, use_message, owned_by_player,
          in_room, locked, unlocks_exit) = row
      return ExitUnlockingItem(name, description, use_message, owned_by_player,
          in_room, locked, unlocks_exit, id=id)
    items.extend(map(exit_unlocking_item_from_row, self.cursor.fetchall()))
    return items


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
  def is_locked(self):
    """
    An Item is locked if the player can not pick it up without
    doing some other action first.
    """
    return self.locked
with_getters_for(Item, 'id', 'use_message', 'owned_by_player', 'in_room')

class ItemUnlockingItem(Item):
  def __init__(self, name,  description, use_message,
      owned_by_player, in_room, locked, unlocks_item, id=None):
    assign_injectables(self, locals())
with_getters_for(ItemUnlockingItem, 'unlocks_item')

class ExitUnlockingItem(Item):
  def __init__(self, name, description, use_message,
      owned_by_player, in_room, locked, unlocks_exit, id=None):
    assign_injectables(self, locals())
with_getters_for(ExitUnlockingItem, 'unlocks_exit')
