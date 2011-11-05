from inject import assign_injectables
from dataaccess import Room, Exit, ItemUnlockingItem, ExitUnlockingItem, Player

class InvalidBuildSpecification(Exception):
  pass

class GameBuilder(object):
  """
  Provides a fluent interface for initializing games.
  Also handles foreign key IDs for the user.
  I can't enforce this, but in general, methods on GameBuilders 
  should be called with all named arguments, and chained.
  """
  def __init__(self, database_service):
    assign_injectables(self, locals())
    self.room_names_to_ids = {}
    self.exit_names_to_ids = {}
    self.item_names_to_ids = {}
    self.created_by_user = None
    self.initial_room_id = None

  def for_user(self, user_id):
    self.created_by_user = user_id
    # Add to the database when done building the rooms
    return self

  def room(self, name, description, final_room=False):
    room = Room(name, description, final_room=final_room)
    added_room = self.database_service.add_room(room)
    self.room_names_to_ids[name] = added_room.get_id()
    return self

  def exit(self, name, description, from_room, to_room, locked=False):
    from_room_id = self.room_names_to_ids[from_room]
    to_room_id = self.room_names_to_ids[to_room]
    exit = Exit(name, description, from_room_id, to_room_id, locked=locked)
    self.exit_names_to_ids[name] = exit.get_id()
    self.database_service.add_exit(exit)
    return self

  def item(self, name, description, use_message, in_room, 
      unlocks, locked=False):
    in_room_id = self.room_names_to_ids[in_room]
    if unlocks in self.exit_names_to_ids:
      item_constructor = ExitUnlockingItem
      unlocks_id = self.exit_names_to_ids[unlocks]
    elif unlocks in self.item_names_to_ids:
      item_constructor = ItemUnlockingItem
      unlocks_id = self.item_names_to_ids[unlocks]
    else:
      raise InvalidBuildSpecification, \
        "Tried to make an unlocker for %s, but it doesn't exist" % \
        (unlocks,)
    item = item_constructor(name, description, use_message,
        None, in_room_id, locked, unlocks_id)
    if isinstance(item, ExitUnlockingItem):
      added_item = self.database_service.add_exit_unlocking_item(item)
    elif isinstance(item, ItemUnlockingItem):
      added_item = self.database_service.add_item_unlocking_item(item)
    else:
      raise NotImplementedError
    self.item_names_to_ids[name] = added_item.get_id()
    return self

  def start_in_room(self, room_name):
    """
    There's only one argument, so not using named arguments
    here is acceptable style.
    """
    self.initial_room_id = self.room_names_to_ids[room_name]
    return self

  def build(self):
    player = Player(self.created_by_user, self.initial_room_id)
    added_player = self.database_service.add_player(player)
    return added_player.get_id()
