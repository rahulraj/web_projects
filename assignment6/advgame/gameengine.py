import random
from inject import assign_injectables
from databaseservice import ItemUnlockingItem, ExitUnlockingItem

class UnknownItemType(Exception):
  pass

class GameEngine(object):
  """ Class to step through the game, prompting the user.  """
  def __init__(self, database_service, player_id):
    """
    Constructor for GameEngines

    Args:
      database_service the database that this depends on.
      player_id the ID of the current player.
    """
    assign_injectables(self, locals())

  def room_and_exits(self):
    """
    Query the database for the current room and its exits.
    Does both in the same function because getting the exits
    requires knowing the room, and querying for the room can
    be an expensive operation. Therefore, if there was a separate
    exits function, code that needs to know both items would end
    up querying for the room twice.

    Returns:
      A (room, exits) tuple containing the Room in the first position,
      and a list of Exits in the second position.
    """
    current_room = self.database_service.find_room_occupied_by_player(
        self.player_id)
    exits = self.database_service.find_exits_from_room(
        current_room.get_id())
    return (current_room, exits)

  def inventory(self):
    """
    Finds the inventory for the player.

    Returns:
      A list of Items that the player has.
    """
    return self.database_service.find_items_owned_by_player(self.player_id)

  def prompt(self):
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
    items_in_room = \
        self.database_service.find_unlocked_items_in_room(current_room.get_id())
    item_names = [item.get_name() for item in items_in_room]
    prompt = """
    You are in %s.
    %s
    """ % (current_room.get_name(), current_room.get_description())
    if len(item_names) != 0:
      prompt += """
      You see the following item(s)
      %s
      """ % ('\n'.join(item_names))
    if len(exit_names) != 0:
      prompt += """
      You see the following exit(s):
      %s
      """ % ('\n'.join(exit_names))
    return prompt

  def possible_actions(self):
    """
    Retrieve the actions a player can do.

    This can be inferred from the data in the database.

    Returns:
      A list of strings that would be valid input.
    """
    (current_room, exits) = self.room_and_exits()
    # Go through an exit
    actions = ['exit ' + exit.get_name() for exit in exits]
    actions.extend(['examine ' + exit.get_name() for exit in exits])
    # Use an item
    inventory = self.inventory()
    actions.extend(['use ' + item.get_name() for item in inventory])
    # Examine an item
    actions.extend(['examine ' + item.get_name() for item in inventory])
    # Take an item
    available_items = \
        self.database_service.find_unlocked_items_in_room(current_room.get_id())
    actions.extend(['take ' + item.get_name() for item in available_items])
    actions.append('inventory')
    actions.append('help')
    return actions

  def try_exit(self, exit_name):
    """
    Helper method to try to move the player through an exit, if it is unlocked.

    Args:
      exit_name the name of the exit.

    Returns:
      The message to send to the player.
    """
    (_, exits) = self.room_and_exits()
    exit_in_use = [exit for exit in exits if exit.get_name() == exit_name][0]
    if exit_in_use.is_locked():
      return 'That exit is locked'
    self.database_service.move_player(self.player_id,
        exit_in_use.get_to_room())
    new_room_description = self.prompt()
    return 'You went through ' + exit_in_use.get_name() + \
        '\n' + new_room_description

  def try_unlock_exit(self, item):
    """
    Helper method to try to use an item to unlock an exit.

    Args:
      item the item to use.

    Returns:
      A message explaining the outcome.
    """
    (_, exits) = self.room_and_exits()
    unlockable_exits = [exit for exit in exits if \
        exit.get_id() == item.get_unlocks_exit()]
    if len(unlockable_exits) == 0:
      return "\tUsing %s didn't do anything." % (item.get_name(),)
    exit = unlockable_exits[0]
    self.database_service.unlock_exit(exit.get_id())
    self.database_service.delete_item(item.get_id())
    return """
        %s
        You can go through the %s now.
        """ % (item.get_use_message(), exit.get_name())

  def try_unlock_item(self, unlocking_item):
    """
    Try to unlock an item.

    Args:
      unlocking_item the item-unlocking item that may open up another
      item in the current room.
    """
    (room, _) = self.room_and_exits()
    locked_items  = self.database_service.find_locked_items_in_room( \
        room.get_id())
    unlockable_items = [item for item in locked_items if \
        item.get_id() == unlocking_item.get_unlocks_item()]
    if len(unlockable_items) == 0:
      return "\tUsing %s didn't do anything." % (unlocking_item.get_name(),)
    to_unlock = unlockable_items[0] 
    self.database_service.unlock_item(to_unlock.get_id())
    self.database_service.delete_item(unlocking_item.get_id())
    return """
        %s
        You can take the %s now. 
        """ % (unlocking_item.get_use_message(), to_unlock.get_name())

  def try_use_item(self, item_name):
    """
    Try to use an item. Delegates to the try_unlock_* functions.

    Args:
      item_name the name of the item to use.

    Returns:
      A message explaining the outcome.
    """
    inventory = self.inventory()
    item = [item for item in inventory if item.get_name() == item_name][0]
    if isinstance(item, ItemUnlockingItem):
      return self.try_unlock_item(item)
    elif isinstance(item, ExitUnlockingItem):
      return self.try_unlock_exit(item)
    else:
      raise UnknownItemType

  def try_examine(self, name):
    """
    Try to examine an item

    Args:
      name the name of the item

    Returns:
      The string description for the item.
    """
    inventory = self.inventory()
    item_names = self.inventory_names()
    if name in item_names:
      items_with_name = [item for item in inventory \
          if item.get_name() == name]
      return items_with_name[0].get_description()
    (_, exits) = self.room_and_exits()
    exit_names = [exit.get_name() for exit in exits]
    if name in exit_names:
      exits_with_name = [exit for exit in exits \
          if exit.get_name() == name]
      return exits_with_name[0].get_description()

  def try_take_item(self, item_name):
    """
    Try to take an item from the current room

    Args:
      item_name the name of the item to take.

    Returns:
      A message explaining the outcome.
    """
    (room, _) = self.room_and_exits()
    items = self.database_service.find_unlocked_items_in_room(room.get_id())
    item_to_take = [item for item in items if item.get_name() == item_name][0]
    self.database_service.move_item_to_player(item_to_take.get_id(),
        self.player_id)
    return "\tYou took the %s." % (item_name,)

  def inventory_names(self):
    """ Returns the names of items in the player's inventory. """
    return [item.get_name() for item in self.inventory()]

  def game_is_over(self):
    """ Return True if the game is over. """
    return self.database_service.player_in_final_room(self.player_id)

  def step(self, action):
    """
    Execute one step throug the game.

    Args:
      action the user-inputted action to take.

    Returns:
      A message explaining the outcome.
    """
    possible_actions = self.possible_actions()
    if action not in possible_actions:
      if action.startswith('use') or action.startswith('examine'):
        return "\tYou don't have one of those."
      elif action.startswith('take'):
        return "\tThere isn't one of those here."
      does_not_understand = [
          "I don't know what you mean by %s." % (action,),
          "That doesn't make any sense.",
          "Stop babbling and give me an action.",
          "Look, I know this game is tough, but that's no reason " +
          "to give me gibberish.",
          "You're kind of bad at this.",
          "Type 'help' to get some help!"
          ]
      return '\t' + random.choice(does_not_understand)
    elif action.startswith('exit'):
      exit_name = action[len('exit'):].strip()
      return self.try_exit(exit_name)
    elif action.startswith('use'):
      item_name = action[len('use'):].strip()
      return self.try_use_item(item_name)
    elif action.startswith('examine'):
      item_name = action[len('examine'):].strip()
      return self.try_examine(item_name)
    elif action.startswith('take'):
      item_name = action[len('take'):].strip()
      return self.try_take_item(item_name)
    elif action == 'inventory':
      inventory_names = self.inventory_names()
      if len(inventory_names) == 0:
        return "\tYou don't have any items."
      else:
        return '\n'.join(self.inventory_names())
    elif action == 'help':
      result = '\tYou can do the following action(s):\n\t\t' + \
          '\n\t\t'.join(possible_actions)
      return result
    else:
      # There's a bug if we came here.
      raise NotImplementedError
