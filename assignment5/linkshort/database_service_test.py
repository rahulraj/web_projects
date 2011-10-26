import unittest
import os
import databaseservice

class DatabaseServiceTest(unittest.TestCase):
  def setUp(self):
    self.database_file = 'test.db'
    with open('schema.sql') as schema:
      databaseservice.initialize_database(self.database_file, schema)
    self.database_cursor = \
        databaseservice.connect_database(self.database_file).cursor()
    self.database = databaseservice.DatabaseService(self.database_cursor)
    self.test_user = databaseservice.User('rahulraj', 'fake_hash', 'fake_salt')

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

  def test_create_pages_for_user(self):
    first_url = 'first_url'
    first_shortened = 'first_shortened'

    second_url = 'second_url'
    second_shortened = 'second_shortened'

    user = self.database.add_user(self.test_user)
    self.database.add_page_for_user(user, first_url, first_shortened)
    self.database.add_page_for_user(user, second_url, second_shortened)

    pages = list(self.database.find_pages_by_user(user))
    self.assertEquals(first_url, pages[0].get_original_url())
    self.assertEquals(first_shortened, pages[0].get_shortened_url())
    self.assertEquals(second_url, pages[1].get_original_url())
    self.assertEquals(second_shortened, pages[1].get_shortened_url())


  def tearDown(self):
    os.unlink(self.database_file)
