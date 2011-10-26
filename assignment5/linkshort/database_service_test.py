import unittest
import os
import databaseservice

class PageVisitTest(unittest.TestCase):
  def setUp(self):
    self.visit = databaseservice.PageVisit(1, 12345)

  def test_visit_values(self):
    self.assertEquals(1, self.visit.get_for_page())
    self.assertEquals(12345, self.visit.get_time_visited())

class DatabaseServiceTest(unittest.TestCase):
  """
  These tests talk to an actual database, so they might run a bit slower.
  """
  def setUp(self):
    self.database_file = 'test.db'
    with open('schema.sql') as schema:
      databaseservice.initialize_database(self.database_file, schema)
    self.database_cursor = \
        databaseservice.connect_database(self.database_file).cursor()
    self.database = databaseservice.DatabaseService(self.database_cursor)

    # Test data
    self.first_url = 'first_url'
    self.first_shortened = 'first_shortened'

    self.second_url = 'second_url'
    self.second_shortened = 'second_shortened'

    self.first_url_first_visit_time = 12345
    self.first_url_second_visit_time = 2345

    self.second_url_first_visit_time = 9876
    self.second_url_second_visit_time = 9999

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

  def test_create_pages_for_user(self):
    user = self.database.add_user(self.test_user)
    self.database.add_page_for_user(user, self.first_url, self.first_shortened)
    self.database.add_page_for_user(user, self.second_url, 
        self.second_shortened)

    pages = list(self.database.find_pages_by_user(user))
    self.assertEquals(2, len(pages))
    self.assertEquals(self.first_url, pages[0].get_original_url())
    self.assertEquals(self.first_shortened, pages[0].get_shortened_url())
    self.assertEquals(self.second_url, pages[1].get_original_url())
    self.assertEquals(self.second_shortened, pages[1].get_shortened_url())

  def test_create_pages_multiple_users(self):
    first_user = self.database.add_user(self.test_user)
    second_user = self.database.add_user(self.second_user)

    self.database.add_page_for_user(first_user,
        self.first_url, self.first_shortened)
    self.database.add_page_for_user(second_user,
        self.second_url, self.second_shortened)

    first_pages = list(self.database.find_pages_by_user(first_user))
    self.assertEquals(1, len(first_pages))
    self.assertEquals(self.first_url, first_pages[0].get_original_url())
    self.assertEquals(self.first_shortened, first_pages[0].get_shortened_url())

    second_pages = list(self.database.find_pages_by_user(second_user))
    self.assertEquals(1, len(second_pages))
    self.assertEquals(self.second_url, second_pages[0].get_original_url())
    self.assertEquals(self.second_shortened,
        second_pages[0].get_shortened_url())

  def test_find_page_by_shortened_url(self):
    first_user = self.database.add_user(self.test_user)
    self.database.add_page_for_user(first_user,
        self.first_url, self.first_shortened)
    self.database.add_page_for_user(first_user,
        self.second_url, self.second_shortened)

    first_page = \
        self.database.find_page_by_shortened_url(self.first_shortened)
    self.assertEquals(self.first_shortened, first_page.get_shortened_url())

    second_page = \
        self.database.find_page_by_shortened_url(self.second_shortened)
    self.assertEquals(self.second_shortened, second_page.get_shortened_url())


  def test_visits_of_pages(self):
    user = self.database.add_user(self.test_user)

    first_page = self.database.add_page_for_user(user,
        self.first_url, self.first_shortened)
    second_page = self.database.add_page_for_user(user,
        self.second_url, self.second_shortened)

    self.database.add_visit_for_page(first_page,
        self.first_url_first_visit_time)
    self.database.add_visit_for_page(first_page,
        self.first_url_second_visit_time)

    self.database.add_visit_for_page(second_page,
        self.second_url_first_visit_time)
    self.database.add_visit_for_page(second_page,
        self.second_url_second_visit_time)

    first_visits = list(self.database.find_visits_of_page(first_page))
    self.assertEquals(2, len(first_visits))
    self.assertEquals(self.first_url_first_visit_time,
        first_visits[0].get_time_visited())
    self.assertEquals(self.first_url_second_visit_time,
        first_visits[1].get_time_visited())

    second_visits = list(self.database.find_visits_of_page(second_page))
    self.assertEquals(2, len(second_visits))
    self.assertEquals(self.second_url_first_visit_time,
        second_visits[0].get_time_visited())
    self.assertEquals(self.second_url_second_visit_time,
        second_visits[1].get_time_visited())

  def tearDown(self):
    os.unlink(self.database_file)
