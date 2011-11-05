import unittest
from gamebuilder import GameBuilder
from dataaccess import Room, Exit, ExitUnlockingItem, ItemUnlockingItem, Player

class FakeDatabaseService(object):
  def __init__(self):
    self.row_id = 0
    self.rooms = []
    self.exits = []
    self.exit_unlocking_items = []
    self.item_unlocking_items = []
    self.player = None

  def add_room(self, room):
    result = Room(room.get_name(), room.get_description(),
        room.is_final_room(), id=self.row_id)
    self.rooms.append(result)
    self.row_id += 1
    return result

  def add_exit(self, exit):
    result = Exit(exit.get_name(), exit.get_description(), exit.get_from_room(),
        exit.get_to_room(), exit.is_locked(), id=self.row_id)
    self.exits.append(result)
    self.row_id += 1
    return result

  def add_exit_unlocking_item(self, item):
    result = ExitUnlockingItem(item.get_name(), item.get_description(),
        item.get_use_message(), item.get_owned_by_player(), item.get_in_room(),
        item.is_locked(), item.get_unlocks_exit(), id=self.row_id)
    self.exit_unlocking_items.append(result)
    self.row_id += 1
    return result

  def add_item_unlocking_item(self, item):
    result = ItemUnlockingItem(item.get_name(), item.get_description(),
        item.get_use_message(), item.get_owned_by_player(), item.get_in_room(),
        item.is_locked(), item.get_unlocks_item(), id=self.row_id)
    self.item_unlocking_items.append(result)
    self.row_id += 1
    return result
  
  def add_player(self, player):
    self.player = player
    result = Player(player.get_created_by_user(),
        player.get_currently_in_room(), id=self.row_id)
    self.row_id += 1
    return result

class GameBuilderTest(unittest.TestCase):
  def setUp(self):
    self.database = FakeDatabaseService()
    self.builder = GameBuilder(self.database)
    self.user_id = 5
    self.builder.for_user(self.user_id)

  def add_rooms(self):
    self.builder. \
        room(name='The testing room',
          description='Room with a Pythonista writing test cases'). \
        room(name='The production room',
          description='Room with production servers')

  def add_exit(self):
    self.builder. \
        exit(name='North', description='The north exit',
          from_room='The testing room', to_room='The production room')

  def finish_build(self):
    return self.builder.start_in_room('The testing room').build()

  def test_simple_room_building(self):
    self.add_rooms()
    self.finish_build()
    self.assertEquals(2, len(self.database.rooms))
    testing_room = [room for room in self.database.rooms \
        if 'testing' in room.get_name()][0]
    self.assertEquals(testing_room.get_id(),
        self.database.player.get_currently_in_room())

  def test_rooms_with_exits(self):
    self.add_rooms()
    self.add_exit()
    self.finish_build()
    self.assertEquals(1, len(self.database.exits))
    testing_room = [room for room in self.database.rooms \
        if 'testing' in room.get_name()][0]
    production_room = [room for room in self.database.rooms \
        if 'production' in room.get_name()][0]
    exit = self.database.exits[0]
    self.assertEquals(testing_room.get_id(), exit.get_from_room())
    self.assertEquals(production_room.get_id(), exit.get_to_room())

if __name__ == '__main__':
  unittest.main()
