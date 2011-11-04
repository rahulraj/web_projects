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

  def test_room_with_exit(self):
    first_room = self.database.add_room(self.test_room)
    second_room = self.database.add_room(self.second_room)
    description = "An Exit from first to second"
    exit = databaseservice.Exit(
        name="Exit 1",
        description=description,
        from_room=first_room.get_id(),
        to_room=second_room.get_id(),
        locked=False)
    self.database.add_exit(exit)

    result = self.database.find_exits_from_room_with_id(first_room.get_id())
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

    result = self.database.find_exits_from_room_with_id(first_room.get_id())
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
    items = self.database.find_unlocked_items_in_room_with_id( \
        first_room.get_id())
    self.assertEquals(0, len(items))
    
  def add_item(self, item_name, room_id):
    item = databaseservice.ItemUnlockingItem(
        name=item_name,
        description='Item description for %s' % (item_name),
        use_message='You used %s' % (item_name),
        owned_by_player=None,
        in_room=room_id,
        locked=False,
        unlocks_item=5)
    return self.database.add_item_unlocking_item(item)

  def test_find_item_in_a_room(self):
    first_room = self.database.add_room(self.test_room)
    first_item_name = 'First item'
    self.add_item(first_item_name, first_room.get_id()) 
    result = self.database.find_unlocked_items_in_room_with_id( \
        first_room.get_id())
    self.assertEquals(1, len(result))
    self.assertEquals(first_item_name, result[0].get_name())

  def test_multiple_items_in_a_room(self):
    first_room = self.database.add_room(self.test_room)
    first_item_name = 'First item'
    self.add_item(first_item_name, first_room.get_id()) 
    second_item_name = 'Second item'
    self.add_item(second_item_name, first_room.get_id())
    result = self.database.find_unlocked_items_in_room_with_id( \
        first_room.get_id()) 
    self.assertEquals(2, len(result))
    self.assertEquals(first_item_name, result[0].get_name())
    self.assertEquals(second_item_name, result[1].get_name())


  def tearDown(self):
    os.unlink(self.database_file)

if __name__ == '__main__':
  unittest.main()
