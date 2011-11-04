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

class NoSuchItem(Exception):
  pass

class PlayerNotInRoom(Exception):
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
    return User.from_row((self.cursor.lastrowid, user.get_username(), 
        user.get_hashed_password(), user.get_salt()))

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
    return User.from_row(row)

  def add_room(self, room):
    """
    Add a room to the configuration.

    Args:
      room the room to add.

    Returns:
      A Room object with id set to the database value.
    """
    self.cursor.execute( \
        'insert into rooms values (null, :name, :description)',
        {'name': room.get_name(), 'description': room.get_description()})
    self.connection.commit()
    return Room.from_row((self.cursor.lastrowid, room.get_name(),
        room.get_description()))

  def find_room_by_name(self, room_name):
    """ TODO Replace, there could be multiple rooms with the
    same name, in multiple instances of the game. """
    self.cursor.execute( \
        'select * from rooms where name=:name',
        {'name': room_name})
    row = self.cursor.fetchone()
    return Room.from_row(row)

  def add_exit(self, exit):
    """
    Add an exit.

    Args:
      exit the Exit to add.

    Returns:
      An Exit with id set.
    """
    self.cursor.execute( \
        """
        insert into exits values (null, :name, :description, :from_room,
            :to_room, :locked)
        """,
        {'name': exit.get_name(), 'description': exit.get_description(),
         'from_room': exit.get_from_room(), 'to_room': exit.get_to_room(),
         'locked': exit.is_locked()})
    self.connection.commit()
    return Exit.from_row((self.cursor.lastrowid, exit.get_name(),
        exit.get_description(), exit.get_from_room(), exit.get_to_room(),
        exit.is_locked()))

  def find_exits_from_room_with_id(self, room_id):
    """
    Find the exits for a room

    Args:
      room_id the ID of the room.

    Returns:
      A list of Exits for that room.
    """
    self.cursor.execute( \
        """    
        select id, name, description, from_room, to_room, locked 
        from exits where from_room=:room_id order by id
        """, {'room_id': room_id})
    return map(Exit.from_row, self.cursor)

  def add_player(self, player):
    """
    Add a player to start a game

    Args:
      player the Player to add.

    Returns:
      A Player with id set.
    """
    self.cursor.execute( \
        """
        insert into players values
            (null, :created_by_user, :currently_in_room)
        """, 
        {'created_by_user': player.get_created_by_user(),
         'currently_in_room': player.get_currently_in_room()})
    return Player.from_row((self.cursor.lastrowid,
        player.get_created_by_user(), player.get_currently_in_room()))

  def insert_item_query(self, item):
    """
    Helper method to insert an item into the database

    Args:
      item the item.

    Returns:
      The row ID for that item.
    """
    self.cursor.execute( \
        """
        insert into items values (null, :name, :description,
            :use_message, :owned_by_player, :in_room, :locked)
        """, 
        {'name': item.get_name(), 'description': item.get_description(),
         'use_message': item.get_use_message(),
         'owned_by_player': item.get_owned_by_player(),
         'in_room': item.get_in_room(), 'locked': item.is_locked()})
    return self.cursor.lastrowid

  def add_item_unlocking_item(self, item):
    """
    Add an item-unlocking item.

    Args:
      item the item.

    Returns:
      An ItemUnlockingItem with id set.
    """
    item_id = self.insert_item_query(item)
    self.cursor.execute( \
        """
        insert into item_unlocking_items values (:item_id, :unlocks_item)
        """,
        {'item_id': item_id, 'unlocks_item': item.get_unlocks_item()})
    return ItemUnlockingItem.from_row((self.cursor.lastrowid, item.get_name(),
        item.get_description(),
        item.get_use_message(),
        item.get_owned_by_player(), item.get_in_room(), item.is_locked(),
        item.get_unlocks_item()))

  def add_exit_unlocking_item(self, item):
    """
    Add an exit-unlocking item.

    Args:
      item the item.

    Returns:
      An ExitUnlockingItem with id set.
    """
    item_id = self.insert_item_query(item)
    self.cursor.execute( \
        """
        insert into exit_unlocking_items values (:item_id, :unlocks_exit)
        """,
        {'item_id': item_id, 'unlocks_exit': item.get_unlocks_exit()})
    return ExitUnlockingItem.from_row((self.cursor.lastrowid, item.get_name(),
        item.get_description(),
        item.get_use_message(),
        item.get_owned_by_player(), item.get_in_room(), item.is_locked(),
        item.get_unlocks_exit()))

  def find_unlocked_items_in_room_with_id(self, room_id):
    """
    Find the unlocked items in a room.

    Args:
      room_id the ID for the room.

    Returns:
      A List of Items in that room which are not locked.
    """
    self.cursor.execute( \
        """
        select items.id, items.name, items.description, items.use_message,
            items.owned_by_player, items.in_room, items.locked,
            item_unlocking_items.unlocks_item
        from items, item_unlocking_items
        where items.id=item_unlocking_items.item_id and items.in_room=:room_id
            and not items.locked
        order by id
        """, {'room_id': room_id})
    items = map(ItemUnlockingItem.from_row, self.cursor)

    # There is some repetition in SQL unfortunately. As far as I know, I can't
    # make a "function" that takes a table, and execute that for the two tables.
    self.cursor.execute( \
        """
        select items.id, items.name, items.description, items.use_message,
            items.owned_by_player, items.in_room, items.locked,
            exit_unlocking_items.unlocks_exit
        from items, exit_unlocking_items
        where items.id=exit_unlocking_items.item_id and items.in_room=:room_id
            and not items.locked
        order by id
        """, {'room_id': room_id})
    items.extend(map(ExitUnlockingItem.from_row, self.cursor))
    return items

  def move_item_to_player(self, item_id, player_id):
    """
    Move an Item to a Player's possesion, taking it out of a room.
    Extracting an items table does avoid having to make two separate
    queries here.

    Args:
      item_id the ID for the item.
      player_id the ID for the player.
    """
    self.cursor.execute( \
        """
        update items
        set owned_by_player=:player_id,
            in_room=null
        where id=:item_id
        """, {'player_id': player_id, 'item_id': item_id})
    self.connection.commit()

  def find_items_owned_by_player(self, player_id):
    """
    Retrieve the Items that a Player has.

    Args:
      player_id the ID of the player.

    Returns:
      A List of Items that the Player has.
    """
    self.cursor.execute( \
        """
        select *
        from items
        where owned_by_player=:player_id
        order by id
        """, {'player_id': player_id})
    def item_from_row(row):
      item_id = row[0]
      self.cursor.execute( \
          """
          select *
          from item_unlocking_items
          where item_id=:item_id
          """, {'item_id': item_id})
      result = self.cursor.fetchone()
      if result is not None:
        return ItemUnlockingItem.from_row(row + (result[1],))
      # It's in exit_unlocking_items
      self.cursor.execute( \
          """
          select *
          from exit_unlocking_items
          where item_id=:item_id
          """, {'item_id': item_id})
      result = self.cursor.fetchone()
      if result is not None:
        return ExitUnlockingItem.from_row(row + (result[1],))
      else:
        raise NoSuchItem
    return map(item_from_row, self.cursor)

  def find_room_occupied_by_player(self, player_id):
    self.cursor.execute( \
        """
        select rooms.id, rooms.name, rooms.description
        from rooms, players
        where players.id=:player_id and players.currently_in_room=rooms.id
        """, {'player_id': player_id})
    result = self.cursor.fetchone()
    if result is None:
      raise PlayerNotInRoom
    return Room.from_row(result)


""" Data access objects, representing rows in the database tables.  """
class User(object):
  def __init__(self, username, hashed_password, salt, id=None):
    assign_injectables(self, locals())

  @classmethod
  def from_row(clazz, row):
    (id, username, hashed_password, salt) = row
    return clazz(username, hashed_password, salt, id=id)
with_getters_for(User, 'id', 'username', 'hashed_password', 'salt')

class Player(object):
  def __init__(self, created_by_user, currently_in_room, id=None):
    assign_injectables(self, locals())

  @classmethod
  def from_row(clazz, row):
    (id, created_by_user, currently_in_room) = row
    return clazz(created_by_user, currently_in_room, id=id)
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

  @classmethod
  def from_row(clazz, row):
    (id, name, description) = row
    return clazz(name, description, id=id)
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

  @classmethod
  def from_row(clazz, row):
    (id, name, description, from_room, to_room, locked) = row
    return clazz(name, description, from_room, to_room, locked, id=id)
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

  @classmethod
  def from_row(clazz, row):
    (id, name, description, use_message, owned_by_player,
        in_room, locked, unlocks_exit) = row
    return clazz(name, description, use_message, owned_by_player,
        in_room, locked, unlocks_exit, id=id)
with_getters_for(ExitUnlockingItem, 'unlocks_exit')
