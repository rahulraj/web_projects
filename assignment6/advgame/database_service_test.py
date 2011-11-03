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
    self.test_room = databaseservice.Room('A test room',
        'This room was created for testing')
    self.second_room = databaseservice.Room('A second room',
        'This room was created for more complex tests')

    self.test_user = databaseservice.User('rahulraj', 'fake_hash', 'fake_salt')
    self.second_user = databaseservice.User('second', 'fake_hash2', 'fake_salt2')

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

  def tearDown(self):
    os.unlink(self.database_file)

if __name__ == '__main__':
  unittest.main()
