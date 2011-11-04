import unittest
from collections import defaultdict
from gameengine import GameEngine
from databaseservice import PlayerNotInRoom, Room, Exit

class FakeDatabaseService(object):
  def __init__(self):
    self.players_to_rooms = {}
    self.rooms_to_exits = defaultdict(lambda: [])

  def add_player_occupied_room(self, player_id, room):
    self.players_to_rooms[player_id] = room

  def find_room_occupied_by_player(self, player_id):
    if player_id not in self.players_to_rooms:
      raise PlayerNotInRoom
    return self.players_to_rooms[player_id]

  def add_room_exit(self, room_id, exit):
    self.rooms_to_exits[room_id].append(exit)

  def find_exits_from_room_with_id(self, room_id):
    if room_id not in self.rooms_to_exits:
      return []
    return self.rooms_to_exits[room_id]

class GameEngineTest(unittest.TestCase):
  def setUp(self):
    self.database = FakeDatabaseService()
    self.game_engine = GameEngine(self.database)
    self.test_room = Room('The Test Room',
        'In this room, you see a Pythonista writing unittest test cases',
        id=2)
    self.production_room = Room('The Production Room',
        'You see a production server running a web app', id=5)
    self.player_id = 6
    self.test_exit = Exit(name='West',
        description='The west exit', from_room=self.test_room.get_id(),
        to_room=self.production_room.get_id(), locked=False, id=7)

  def test_prompt_for_player(self):
    self.database.add_player_occupied_room(self.player_id, self.test_room)
    prompt = self.game_engine.prompt_for_player(self.player_id)
    self.assertTrue(self.test_room.get_name() in prompt)

  def test_exits_displayed(self):
    self.database.add_player_occupied_room(self.player_id, self.test_room)
    self.database.add_room_exit(self.test_room.get_id(), self.test_exit)
    prompt = self.game_engine.prompt_for_player(self.player_id)
    self.assertTrue(self.test_exit.get_name() in prompt)

if __name__ == '__main__':
  unittest.main()
