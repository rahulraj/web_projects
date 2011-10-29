import unittest
import tempfile
import os
import simplejson as json
from functools import partial
import __init__ as linkshort

class LinkShortTest(unittest.TestCase):
  def setUp(self):
    self.database_handle, linkshort.app.database = tempfile.mkstemp()
    self.app = linkshort.app.test_client()
    linkshort.initialize_database()

  def test_get_index(self):
    """ 
    Send a get request to /, it should return a template.
    The test won't inspect the template too closely, because the
    goal is to test the controller, not the presentation logic.
    i.e. if the GUI is redesigned, these tests should not break.
    """
    output = self.app.get('/')
    self.assertTrue('Link Shortener' in output.data)

  def register(self, username, password, confirmation):
    return self.app.post('/register', data=dict(
        username=username,
        password=password,
        confirmPassword=confirmation
      ), follow_redirects=True)

  def register_test_user(self):
    return self.register('test_user', 'test_password', 'test_password')

  def login(self, username, password):
    return self.app.post('/login', data=dict(
        username=username,
        password=password
      ), follow_redirects=True)

  def login_test_user(self):
    return self.login('test_user', 'test_password')

  def logout(self):
    return self.app.get('/logout', follow_redirects=True)

  def dict_from_request(self, request_function):
    """
    Executes request_function, and then converts the JSON
    response into a dict. Returns the dict.
    """
    result = request_function()
    return json.loads(result.data)

  def test_simple_registration(self):
    result = self.dict_from_request(self.register_test_user)
    self.assertTrue(result['success'])

  def test_invalid_confirmation_in_registration(self):
    invalid_register = partial(self.register, 'another_user', 'paswod', 'password')
    result = self.dict_from_request(invalid_register)
    self.assertFalse(result['success'])

  def test_duplicate_username_fails_registration(self):
    self.register_test_user()
    result = self.dict_from_request(self.register_test_user)
    self.assertFalse(result['success'])

  def test_blank_password_fails_registration(self):
    invalid_register = partial(self.register, 'user', '', '')
    result = self.dict_from_request(invalid_register)
    self.assertFalse(result['success'])

  def test_spaces_password_fails_registration(self):
    invalid_register = partial(self.register, 'user', ' ', ' ')
    result = self.dict_from_request(invalid_register)
    self.assertFalse(result['success'])

  def test_spaces_in_password_fails_registration(self):
    invalid_register = partial(self.register, 'user', 'hi there', 'hi there')
    result = self.dict_from_request(invalid_register)
    self.assertFalse(result['success'])

  def test_login_fails_with_new_user(self):
    invalid_login = partial(self.login, 'user', 'password')
    result = self.dict_from_request(invalid_login)
    self.assertFalse(result['success'])

  def test_login_succeeds_after_registration(self):
    self.register_test_user()
    result = self.dict_from_request(self.login_test_user)
    self.assertTrue(result['success'])

  def add_page(self, original_url, shortened_url):
    return self.app.post('/pages', data=dict(
        originalUrl=original_url, 
        outputUrl=shortened_url
      ), follow_redirects=True)

  def get_pages(self):
    return self.app.get('/pages', follow_redirects=True)

  def test_no_pages_initially(self):
    self.register_test_user()
    pages = self.dict_from_request(self.get_pages)
    self.assertEquals(0, len(pages['pages']))

  def test_shorten_page_fails_for_blank_page(self):
    self.register_test_user()
    invalid_add_page = partial(self.add_page, '', '')
    result = self.dict_from_request(invalid_add_page)
    self.assertFalse(result['success'])

  def test_get_pages_fails_when_no_user(self):
    result = self.get_pages()
    self.assertEquals(401, result.status_code)

  def test_shorten_pages_fails_when_no_user(self):
    result = self.add_page('www.google.com', '')
    self.assertEquals(401, result.status_code)

  def test_simple_shorten_page(self):
    self.register_test_user()
    add_page = partial(self.add_page, 'www.google.com', '')
    result = self.dict_from_request(add_page)
    self.assertTrue(result['success'])

  def test_shorten_page_provided_value(self):
    self.register_test_user()
    add_page = partial(self.add_page, 'www.google.com', 'search')
    result = self.dict_from_request(add_page)
    self.assertTrue(result['success'])
    self.assertEquals('search', result['shortenedUrl'])

  def test_shortened_urls_must_be_unique(self):
    self.test_shorten_page_provided_value()
    add_page = partial(self.add_page, 'www.duckduckgo.com', 'search')
    result = self.dict_from_request(add_page)
    self.assertFalse(result['success'])

  def test_shortened_pages_are_added_to_users_pages(self):
    self.test_simple_shorten_page()
    result = self.dict_from_request(self.get_pages)
    self.assertEquals(1, len(result['pages']))

  def test_no_page_visits_initially(self):
    self.test_simple_shorten_page()
    result = self.dict_from_request(self.get_pages)
    self.assertEquals(0, len(result['pages'][0]['visits']))

  def test_page_visits_are_logged(self):
    self.test_shorten_page_provided_value()
    self.app.get('/search')
    result = self.dict_from_request(self.get_pages)
    self.assertEquals(1, len(result['pages'][0]['visits']))

  def tearDown(self):
    os.close(self.database_handle)
    os.unlink(linkshort.app.database)

if __name__ == '__main__':
  unittest.main()
