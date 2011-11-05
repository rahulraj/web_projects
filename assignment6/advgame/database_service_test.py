import unittest
import os
import databaseservice

class DatabaseServiceTest(unittest.TestCase):
  """
  These tests talk to an actual database, so they might run a bit slower.
  """
  def setUp(self):
    self.database_file = 'test.db'
    with open('schema.sql') as schema:
      databaseservice.initialize_database(self.database_file, schema)
    self.database_connection = \
        databaseservice.connect_database(self.database_file)
    self.database_cursor = self.database_connection.cursor()
    self.database = databaseservice.DatabaseService( \
        self.database_connection, self.database_cursor)

    # Test data
    self.test_user = databaseservice.User('rahulraj', 'fake_hash', 'fake_salt')
    self.second_user = databaseservice.User('second', 'fake_hash2', 'fake_salt2')

    self.test_room = databaseservice.Room('A test room',
        'This room was created for testing')
    self.second_room = databaseservice.Room('A second room',
        'This room was created for more complex tests')
    self.third_room = databaseservice.Room('A third room',
        'This room was created for even more complex tests')

  def test_user_not_initially_in_database(self):
    self.assertFalse( \
        self.database.has_user_with_name(self.test_user.get_username()))

  def test_create_user_and_find(self):
    self.database.add_user(self.test_user)
    self.assertTrue(self.database.has_user_with_name( \
        self.test_user.get_username()))
    user = self.database.find_user_by_name(self.test_user.get_username())
    self.assertEquals(self.test_user.get_hashed_password(),
        user.get_hashed_password())
    self.assertEquals(self.test_user.get_salt(), user.get_salt())

  def test_last_row_id_is_correct(self):
    added_user = self.database.add_user(self.test_user)
    row_id = added_user.get_id()
    self.database_cursor.execute( \
        'select * from users where id=:id', {'id': row_id})
    result_row = self.database_cursor.fetchone()
    self.assertEquals(row_id, result_row[0])
    self.assertTrue(result_row[0] is not None)

  def test_add_room(self):
    self.database.add_room(self.test_room)
    room = self.database.find_room_by_name(self.test_room.get_name())
    self.assertEquals(self.test_room.get_description(), room.get_description())

  def add_rooms_with_exit(self, locked=False):
    first_room = self.database.add_room(self.test_room)
    second_room = self.database.add_room(self.second_room)
    description = "An Exit from first to second"
    exit = databaseservice.Exit(
        name="Exit 1",
        description=description,
        from_room=first_room.get_id(),
        to_room=second_room.get_id(),
        locked=locked)
    added_exit = self.database.add_exit(exit)
    return (first_room, second_room, description, added_exit)

  def test_room_with_exit(self):
    (first_room, _, description, _) = self.add_rooms_with_exit()
    result = self.database.find_exits_from_room(first_room.get_id())
    self.assertEquals(1, len(result))
    self.assertEquals(description, result[0].get_description())

  def test_multiple_exits_from_a_room(self):
    first_room = self.database.add_room(self.test_room)
    second_room = self.database.add_room(self.second_room)
    third_room = self.database.add_room(self.third_room)
    first_description = "An Exit from first to second"
    first_exit = databaseservice.Exit(
        name="Exit 1",
        description=first_description,
        from_room=first_room.get_id(),
        to_room=second_room.get_id(),
        locked=False)
    self.database.add_exit(first_exit)

    second_description = "An Exit from first to third"
    second_exit = databaseservice.Exit(
        name="Exit 2",
        description=second_description,
        from_room=first_room.get_id(),
        to_room=third_room.get_id(),
        locked=False)
    self.database.add_exit(second_exit)

    result = self.database.find_exits_from_room(first_room.get_id())
    self.assertEquals(2, len(result))
    self.assertEquals(first_description, result[0].get_description())
    self.assertEquals(second_description, result[1].get_description())

  def test_add_player(self):
    user_id = 2
    current_room_id = 5
    player = databaseservice.Player(user_id, current_room_id)
    result_player = self.database.add_player(player)
    self.database_cursor.execute(
        'select * from players where id=:id', {'id': result_player.get_id()})
    database_output = self.database_cursor.fetchone()
    self.assertEquals(user_id, database_output[1])
    self.assertEquals(current_room_id, database_output[2])

  def test_no_items_in_a_room_initially(self):
    first_room = self.database.add_room(self.test_room)
    items = self.database.find_unlocked_items_in_room( \
        first_room.get_id())
    self.assertEquals(0, len(items))
    
  def make_item(self, constructor, item_name, room_id, locked):
    return constructor(
        item_name, 'Item description for %s' % (item_name),
        'You used %s' % (item_name), None, room_id, locked, 5)

  def test_find_item_in_a_room(self):
    first_room = self.database.add_room(self.test_room)
    first_item_name = 'First item'
    first_item = self.make_item(databaseservice.ItemUnlockingItem,
        first_item_name, first_room.get_id(), locked=False)
    self.database.add_item_unlocking_item(first_item)
    result = self.database.find_unlocked_items_in_room( \
        first_room.get_id())
    self.assertEquals(1, len(result))
    self.assertEquals(first_item_name, result[0].get_name())

  def test_multiple_items_in_a_room(self):
    first_room = self.database.add_room(self.test_room)
    first_item_name = 'First item'
    first_item = self.make_item(databaseservice.ItemUnlockingItem,
        first_item_name, first_room.get_id(), locked=False) 
    self.database.add_item_unlocking_item(first_item)
    second_item_name = 'Second item'
    second_item = self.make_item(databaseservice.ExitUnlockingItem,
        second_item_name, first_room.get_id(), locked=False)
    self.database.add_exit_unlocking_item(second_item)
    result = self.database.find_unlocked_items_in_room( \
        first_room.get_id()) 
    self.assertEquals(2, len(result))
    self.assertEquals(first_item_name, result[0].get_name())
    self.assertEquals(second_item_name, result[1].get_name())

  def test_finding_items_ignores_locked_items(self):
    first_room = self.database.add_room(self.test_room)
    first_item_name = 'First item'
    first_item = self.make_item(databaseservice.ItemUnlockingItem,
        first_item_name, first_room.get_id(), locked=False) 
    self.database.add_item_unlocking_item(first_item)
    second_item_name = 'Second item'
    second_item = self.make_item(databaseservice.ExitUnlockingItem,
        second_item_name, first_room.get_id(), locked=True)
    self.database.add_exit_unlocking_item(second_item)
    result = self.database.find_unlocked_items_in_room( \
        first_room.get_id()) 
    self.assertEquals(1, len(result))
    self.assertEquals(first_item_name, result[0].get_name())

  def test_player_picks_up_items(self):
    user_id = 2
    current_room_id = 5
    player = databaseservice.Player(user_id, current_room_id)
    first_player = self.database.add_player(player)
    make_item1 = self.make_item(databaseservice.ItemUnlockingItem,
        'First item', current_room_id, locked=False) 
    first_item = self.database.add_item_unlocking_item(make_item1)
    make_item2 = self.make_item(databaseservice.ExitUnlockingItem,
        'Second item', current_room_id, locked=False)
    self.database.add_exit_unlocking_item(make_item2)
    self.database.move_item_to_player(first_item.get_id(), first_player.get_id())
    result = self.database.find_items_owned_by_player(first_player.get_id())
    self.assertEquals(1, len(result))
    self.assertEquals(first_item.get_id(), result[0].get_id())

  def test_player_room_occupied(self):
    test_room = self.database.add_room(self.test_room)
    player = databaseservice.Player(created_by_user=1,
        currently_in_room=test_room.get_id())
    test_player = self.database.add_player(player)
    room_result = self.database.find_room_occupied_by_player( \
        test_player.get_id())
    self.assertEquals(test_room.get_id(), room_result.get_id())

  def test_move_player(self):
    test_room = self.database.add_room(self.test_room)
    second_room = self.database.add_room(self.second_room)
    player = databaseservice.Player(created_by_user=1,
        currently_in_room=test_room.get_id())
    test_player = self.database.add_player(player)
    self.database.move_player(test_player.get_id(), second_room.get_id())
    result = self.database.find_room_occupied_by_player( \
        test_player.get_id()) 
    self.assertEquals(second_room.get_id(), result.get_id())

  def test_unlock_exit(self):
    (first_room, _, _, exit) = self.add_rooms_with_exit(locked=True)
    self.database.unlock_exit(exit.get_id())
    exit_result = self.database.find_exits_from_room(first_room.get_id())[0]
    self.assertFalse(exit_result.is_locked())

  def test_delete_item(self):
    room_id = 2
    item = self.make_item(databaseservice.ItemUnlockingItem,
        'First item', room_id, locked=False)
    added_item = self.database.add_item_unlocking_item(item)
    self.database.delete_item(added_item.get_id())
    in_room = self.database.find_unlocked_items_in_room(room_id)
    self.assertEquals(0, len(in_room))

  def tearDown(self):
    os.unlink(self.database_file)

if __name__ == '__main__':
  unittest.main()
