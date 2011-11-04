from inject import assign_injectables

class GameEngine(object):
  def __init__(self, database_service):
    assign_injectables(self, locals())

  def prompt_for_player(self, player_id):
    """
    Uses player_id to query the database and determine
    the prompt to provide to the player.

    Args:
      player_id the ID of the player.

    Returns:
      A string prompt for the player.
    """
    current_room = self.database_service.find_room_occupied_by_player(player_id)
    exits = self.database_service.find_exits_from_room_with_id( \
        current_room.get_id())
    exit_names = [exit.get_name() for exit in exits]
    return """
    You are in the %s.
    %s
    The following exits exist:
    %s
    """ % (current_room.get_name(), current_room.get_description(),
        '\n'.join(exit_names))

  def possible_actions(self, player_id):
    current_room = self.database_service.find_room_occupied_by_player(player_id)
    exits = self.database_service.find_exits_from_room_with_id( \
        current_room.get_id())
    # Go through an exit
    actions = ['exit ' + exit.get_name() for exit in exits]
    inventory = self.database_service.find_items_owned_by_player(player_id)
    # Use an item
    actions.extend(['use ' + item.get_name() for item in inventory])
    return actions
