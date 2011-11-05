from inject import assign_injectables

class GameEngine(object):
  def __init__(self, database_service, player_id):
    assign_injectables(self, locals())

  def room_and_exits(self):
    current_room = self.database_service.find_room_occupied_by_player( \
        self.player_id)
    exits = self.database_service.find_exits_from_room_with_id( \
        current_room.get_id())
    return (current_room, exits)


  def prompt_for_player(self):
    """
    Uses player_id to query the database and determine
    the prompt to provide to the player.

    Args:
      player_id the ID of the player.

    Returns:
      A string prompt for the player.
    """
    (current_room, exits) = self.room_and_exits()
    exit_names = [exit.get_name() for exit in exits]
    return """
    You are in the %s.
    %s
    You see the following exit(s):
    %s
    """ % (current_room.get_name(), current_room.get_description(),
        '\n'.join(exit_names))

  def possible_actions(self):
    (current_room, exits) = self.room_and_exits()
    # Go through an exit
    actions = ['exit ' + exit.get_name() for exit in exits]
    # Use an item
    inventory = self.database_service.find_items_owned_by_player(self.player_id)
    actions.extend(['use ' + item.get_name() for item in inventory])
    # Take an item
    """
    available_items = \
        self.database_service.find_unlocked_items_in_room_with_id( \
        current_room.get_id)
    """
    return actions

  def try_exit(self, exit_name):
    (_, exits) = self.room_and_exits()
    exit_in_use = [exit for exit in exits if exit.get_name() == exit_name][0]
    if exit_in_use.is_locked():
      return 'That exit is locked'
    self.database_service.move_player(self.player_id,
        exit_in_use.get_to_room())
    return 'You went through ' + exit_in_use.get_name()

  def try_use_item(self, item_name):
    inventory = self.database_service.find_items_owned_by_player(self.player_id)
    if item_name not in inventory:
      return "You don't have a " + item_name

  def step(self, action):
    possible_actions = self.possible_actions()
    if action not in possible_actions:
      return "I don't know what you mean by " + action
    if action.startswith('exit'):
      exit_name = action[len('exit'):].strip()
      return self.try_exit(exit_name)
    elif action.startswith('use'):
      item_name = action[len('use'):].strip()
      return self.try_use_item(item_name)
    elif action.startswith('take'):
      raise NotImplementedError
    else:
      raise NotImplementedError
