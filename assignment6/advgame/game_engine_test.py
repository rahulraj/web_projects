import unittest
from collections import defaultdict
from gameengine import GameEngine
from databaseservice import PlayerNotInRoom, Room, Exit, ExitUnlockingItem, ItemUnlockingItem

class FakeDatabaseService(object):
  def __init__(self):
    self.players_to_rooms = {}
    self.players_to_room_ids = {}
    self.rooms_to_exits = defaultdict(lambda: [])
    self.rooms_to_items = defaultdict(lambda: [])
    self.players_to_items = defaultdict(lambda: [])
    self.rooms = []

  def stub_add_player_occupied_room(self, player_id, room):
    self.players_to_rooms[player_id] = room
    self.players_to_room_ids[player_id] = room.get_id()

  def find_room_occupied_by_player(self, player_id):
    if player_id not in self.players_to_rooms:
      raise PlayerNotInRoom
    return self.players_to_rooms[player_id]

  def stub_add_room_exit(self, room_id, exit):
    self.rooms_to_exits[room_id].append(exit)

  def find_exits_from_room(self, room_id):
    if room_id not in self.rooms_to_exits:
      return []
    return self.rooms_to_exits[room_id]

  def stub_add_item_to_player(self, item, player_id):
    item.owned_by_player = player_id
    item.in_room = None
    self.players_to_items[player_id].append(item)

  def find_items_owned_by_player(self, player_id):
    return self.players_to_items[player_id]

  def stub_add_item_to_room(self, item, room_id):
    self.rooms_to_items[room_id].append(item)

  def find_unlocked_items_in_room(self, room_id):
    return [item for item in self.rooms_to_items[room_id] \
        if not item.is_locked()]

  def find_locked_items_in_room(self, room_id):
    return [item for item in self.rooms_to_items[room_id] \
        if item.is_locked()]

  def stub_add_room(self, room):
    self.rooms.append(room)

  def move_player(self, player_id, new_room_id):
    self.players_to_room_ids[player_id] = new_room_id
    # Use stub_add_room from a test function to make this
    # aware of the new room.
    new_room = [room for room in self.rooms if room.get_id() == new_room_id][0]
    self.players_to_rooms[player_id] = new_room

  def move_item_to_player(self, item_id, player_id):
    room_with_item = self.players_to_rooms[player_id]
    for item in self.rooms_to_items[room_with_item.get_id()]:
      if item.get_id() == item_id:
        moved_item = item
        self.rooms_to_items[room_with_item.get_id()].remove(item)
        break
    self.players_to_items[player_id].append(moved_item)

  def unlock_exit(self, exit_id):
    for room in self.rooms_to_exits:
      for exit in self.rooms_to_exits[room]:
        if exit.get_id() == exit_id:
          exit.locked = False

  def unlock_item(self, item_id):
    for room in self.rooms_to_items:
      for item in self.rooms_to_items[room]:
        if item.get_id() == item_id:
          item.locked = False

  def delete_item(self, item_id):
    for room in self.rooms_to_items:
      self.rooms_to_items[room] = [item for item in self.rooms_to_items[room] \
          if item.get_id() != item_id]
    for player in self.players_to_items:
      self.players_to_items[player] = [item for item in \
          self.players_to_items[player] if item.get_id() != item_id]

class GameEngineTest(unittest.TestCase):
  def setUp(self):
    self.database = FakeDatabaseService()
    self.test_room = Room('The Test Room',
        'In this room, you see a Pythonista writing unittest test cases',
        id=2)
    self.production_room = Room('The Production Room',
        'You see a production server running a web app', id=5)
    self.player_id = 6
    self.test_exit = Exit(name='West',
        description='The west exit', from_room=self.test_room.get_id(),
        to_room=self.production_room.get_id(), locked=False, id=7)
    self.test_item = ExitUnlockingItem(name='TPS Report',
        description='A testing specification',
        use_message='You read the report',
        owned_by_player=None,
        in_room=self.test_room.get_id(),
        locked=False, unlocks_exit=7, id=9)
    self.game_engine = GameEngine(self.database, self.player_id)

  def test_prompt_for_player(self):
    self.database.stub_add_player_occupied_room(self.player_id, self.test_room)
    prompt = self.game_engine.prompt()
    self.assertTrue(self.test_room.get_name() in prompt)

  def add_test_room_and_test_exit(self):
    self.database.stub_add_player_occupied_room(self.player_id, self.test_room)
    self.database.stub_add_room_exit(self.test_room.get_id(), self.test_exit)

  def test_exits_displayed(self):
    self.add_test_room_and_test_exit()
    prompt = self.game_engine.prompt()
    self.assertTrue(self.test_exit.get_name() in prompt)

  def test_items_displayed(self):
    self.add_test_room_and_test_exit()
    self.database.stub_add_item_to_room(self.test_item, self.test_room.get_id())
    prompt = self.game_engine.prompt()
    self.assertTrue(self.test_item.get_name() in prompt)

  def test_possible_actions_displays_exit(self):
    self.add_test_room_and_test_exit()
    actions = self.game_engine.possible_actions()
    exit_actions = [action for action in actions if 'exit' in action]
    self.assertEquals(1, len(exit_actions))
    self.assertTrue(self.test_exit.get_name() in exit_actions[0])

  def test_possible_actions_displays_items_that_the_player_has(self):
    self.add_test_room_and_test_exit()
    self.database.stub_add_item_to_player(self.test_item, self.player_id)
    actions = self.game_engine.possible_actions()
    item_actions = [action for action in actions if 'use' in action]
    self.assertEquals(1, len(item_actions))
    item_action = item_actions[0]
    self.assertTrue(self.test_item.get_name() in item_action)

  def add_test_room_exit_and_item_to_room(self):
    self.add_test_room_and_test_exit()
    self.database.stub_add_item_to_room(self.test_item, self.test_room.get_id())

  def test_possible_actions_displays_takeable_items(self):
    self.add_test_room_exit_and_item_to_room()
    actions = self.game_engine.possible_actions()
    take_actions = [action for action in actions if 'take' in action]
    self.assertEquals(1, len(take_actions))
    take_action = take_actions[0]
    self.assertTrue(self.test_item.get_name() in take_action)

  def test_step_move_through_exit_changes_room(self):
    self.add_test_room_and_test_exit()
    self.database.stub_add_room(self.production_room)
    self.game_engine.step('exit ' + self.test_exit.get_name())
    self.assertEquals(self.production_room.get_id(),
        self.database.players_to_room_ids[self.player_id])

  def test_step_does_not_change_room_if_exit_locked(self):
    self.test_exit.locked = True
    self.add_test_room_and_test_exit()
    self.game_engine.step('exit ' + self.test_exit.get_name())
    self.assertEquals(self.test_room.get_id(),
        self.database.players_to_rooms[self.player_id].get_id())

  def test_step_take_item(self):
    self.add_test_room_exit_and_item_to_room()
    self.game_engine.step('take ' + self.test_item.get_name())
    self.assertTrue(self.test_item not in \
        self.database.rooms_to_items[self.test_room.get_id()])
    self.assertTrue(self.test_item in \
        self.database.players_to_items[self.player_id])

  def test_step_take_item_does_nothing_if_item_doesnt_exist(self):
    self.add_test_room_exit_and_item_to_room()
    self.game_engine.step('take NonExistentItem')
    self.assertTrue(self.test_item in \
        self.database.rooms_to_items[self.test_room.get_id()])
    self.assertFalse('NonExistentItem' in \
        self.database.players_to_items[self.player_id])

  def test_step_use_item_to_unlock_exit(self):
    self.add_test_room_exit_and_item_to_room()
    # self.test_item is set in setUp to unlock self.test_exit
    self.test_exit.locked = True
    self.game_engine.step('take ' + self.test_item.get_name())
    self.game_engine.step('use ' + self.test_item.get_name())
    self.assertFalse(self.test_exit.locked)
    self.assertTrue(self.test_item not in \
        self.database.players_to_items[self.player_id])

  def test_step_use_item_fails_if_nothing_to_unlock(self):
    self.add_test_room_exit_and_item_to_room()
    self.test_exit.locked = True
    self.test_item.unlocks_exit = 45 # Not self.test_exit
    self.game_engine.step('take ' + self.test_item.get_name())
    self.game_engine.step('use ' + self.test_item.get_name())
    self.assertTrue(self.test_exit.locked)
    self.assertTrue(self.test_item in \
        self.database.players_to_items[self.player_id])

  def test_step_use_item_to_unlock_item(self):
    self.add_test_room_exit_and_item_to_room()
    self.test_item.locked = True
    key = ItemUnlockingItem(
        name='Key to the TPS report drawer',
        description='A metal key',
        use_message='You put the key in the lock and turned it',
        owned_by_player=None,
        in_room=self.test_room.get_id(),
        locked=False,
        unlocks_item=self.test_item.get_id(),
        id=19)
    self.database.stub_add_item_to_room(key, self.test_room.get_id())
    self.game_engine.step('take ' + key.get_name())
    self.game_engine.step('use ' + key.get_name())
    self.assertFalse(self.test_item.locked)

if __name__ == '__main__':
  unittest.main()
