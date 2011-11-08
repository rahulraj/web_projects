from inject import assign_injectables
from dataaccess import Room, Exit, ItemUnlockingItem, ExitUnlockingItem, Player

class DisallowedModification(Exception):
  pass

class SingleAssignmentDict(dict):
  """
  A dict that raises DisallowedModification if a user tries to clobber
  existing values. Mutator methods are overriden.
  """

  @classmethod
  def of(clazz, **kwargs):
    """
    Syntatic sugar to create a single-assignment dict with string keys
    using kwargs.

    Args:
      **kwargs the keywords and values to include in the dict
    """
    return clazz(kwargs)

  def __setitem__(self, new_key, new_value):
    if new_key in self:
      raise DisallowedModification
    super(SingleAssignmentDict, self).__setitem__(new_key, new_value)

  def pop(self, key, default=None):
    raise DisallowedModification

  def popitem(self):
    raise DisallowedModification

  def setdefault(self, key, default=None):
    raise DisallowedModification

  def update(*args, **kwargs):
    raise DisallowedModification

class InvalidBuildSpecification(Exception):
  """ "Compile-time" errors in the game building language. """
  pass

class GameBuilder(object):
  """
  Provides a fluent interface for initializing games in
  a declarative fashion, to make it easier to modify scenarios.
  Also handles foreign key IDs for the user.
  I can't enforce this, but in general, methods on GameBuilders 
  should be called with all named arguments, and chained.
  """
  def __init__(self, database_service):
    """
    Constructor for GameBuilders

    Args:
      database_service the service to use for persistence.
    """
    assign_injectables(self, locals())
    self.room_names_to_ids = SingleAssignmentDict()
    self.exit_names_to_ids = SingleAssignmentDict()
    self.item_names_to_ids = SingleAssignmentDict()
    self.created_by_user = None
    self.initial_room_id = None

  def for_user(self, user_id):
    """
    Set the user

    Args:
      user_id the ID of the user.

    Returns:
      self for chaining method calls.
    """
    self.created_by_user = user_id
    # Add to the database when done building the rooms
    return self

  def room(self, name, description, final_room=False):
    """
    Declare a room

    Args:
      name the name of the room.
      description the description for the room.
      final_room whether this is the last room.

    Returns:
      self for chaining method calls.
    """
    room = Room(name, description, final_room=final_room)
    added_room = self.database_service.add_room(room)
    self.room_names_to_ids[name] = added_room.get_id()
    return self

  def exit(self, name, description, from_room, to_room, locked=False):
    """
    Declare an exit from one room to another room

    Args:
      name the name of the exit.
      description the description for the exit.
      from_room the name of the room this exit leads out of. The room
                must be declared or a KeyError will occur.
      to_room the name of the room this exit leads to. Must be declared before.
      locked whether the exit is locked

    Returns:
      self for chaining method calls.

    Raises:
      KeyError if a room is referred to out of order.
    """
    from_room_id = self.room_names_to_ids[from_room]
    to_room_id = self.room_names_to_ids[to_room]
    exit = Exit(name, description, from_room_id, to_room_id, locked=locked)
    added_exit = self.database_service.add_exit(exit)
    self.exit_names_to_ids[name] = added_exit.get_id()
    return self

  def item(self, name, description, use_message, in_room, 
      unlocks, locked=False):
    """
    Declare an item

    Args:
      name the name of the item.
      description the description for the item.
      use_message the message when the item is used.
      in_room the name of the room the item is in
      unlocks the name of the exit or item that this item unlocks
      locked whether the item is locked.

    Returns:
      self for chaining method calls.

    Raises:
      KeyError if the room wasn't declared beforehand.
      InvalidBuildSpecification if unlocks wasn't declared.
    """
    in_room_id = self.room_names_to_ids[in_room]
    if unlocks in self.exit_names_to_ids:
      unlocks_id = self.exit_names_to_ids[unlocks]
      item = ExitUnlockingItem(
          name=name,
          description=description,
          use_message=use_message,
          owned_by_player=None,
          in_room=in_room_id,
          locked=locked,
          unlocks_exit=unlocks_id)
      added_item = self.database_service.add_exit_unlocking_item(item)
    elif unlocks in self.item_names_to_ids:
      unlocks_id = self.item_names_to_ids[unlocks]
      item = ItemUnlockingItem(
          name=name,
          description=description,
          use_message=use_message,
          owned_by_player=None,
          in_room=in_room_id,
          locked=locked,
          unlocks_item=unlocks_id)
      added_item = self.database_service.add_item_unlocking_item(item)
    else:
      raise InvalidBuildSpecification, \
        "Tried to make an unlocker for %s, but it doesn't exist" % \
        (unlocks,)
    self.item_names_to_ids[name] = added_item.get_id()
    return self

  def start_in(self, room_name):
    """
    Name the room to start the player in.
    There's only one argument, so not using named arguments
    here is acceptable style.

    Args:
      room_name the name of the room.

    Returns:
      self for chaining method calls.

    Raises:
      KeyError if the room wasn't created first.
    """
    self.initial_room_id = self.room_names_to_ids[room_name]
    return self

  def build(self):
    """
    Finish the building.

    Returns:
      the id of the player playing the game. Future queries can
      access the game state through this player id.
    """
    player = Player(self.created_by_user, self.initial_room_id)
    added_player = self.database_service.add_player(player)
    return added_player.get_id()
