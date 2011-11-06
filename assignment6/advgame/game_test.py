import unittest
import tempfile
import os
import simplejson as json
from functools import partial
import __init__ as advgame

class AdventureGameTest(unittest.TestCase):
  def setUp(self):
    self.database_handle, advgame.app.database = tempfile.mkstemp()
    self.app = advgame.app.test_client()
    advgame.initialize_database()

  def test_get_index(self):
    """ 
    Send a get request to /, it should return a template.
    The test won't inspect the template too closely, because the
    goal is to test the controller, not the presentation logic.
    i.e. if the GUI is redesigned, these tests should not break.
    """
    output = self.app.get('/')
    self.assertTrue('Adventure Game' in output.data)

  def register(self, username, password, confirmation):
    return self.app.post('/users/new', data=dict(
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

  def test_game_start(self):
    self.register_test_user()
    result = self.app.post('/game/new', data=dict(), follow_redirects=True)
    self.assertTrue(len(result.data) > 0)

  def test_get_initial_prompt(self):
    self.register_test_user()
    self.app.post('/game/new', data=dict(), follow_redirects=True)
    result = self.app.get('/game', data=dict(), follow_redirects=True)
    self.assertTrue(len(result.data) > 0)

  def test_perform_action_in_game(self):
    self.register_test_user()
    self.app.post('/game/new', data=dict(), follow_redirects=True)
    post_request = partial(self.app.post, '/game',
        data=dict(userInput='inventory'), follow_redirects=True)
    result = self.dict_from_request(post_request)
    self.assertTrue(len(result['prompt']) > 0)

  def tearDown(self):
    os.close(self.database_handle)
    os.unlink(advgame.app.database)

if __name__ == '__main__':
  unittest.main()
