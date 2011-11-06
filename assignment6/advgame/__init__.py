from flask import Flask, g, session, render_template, jsonify, request, redirect, url_for
import databaseservice
from users import Users, confirmed_password_valid
from gamebuilder import GameBuilder
from gameengine import GameEngine
from gameconfigurations import simple_game

app = Flask(__name__)
app.config.from_object(__name__)
app.secret_key = \
    '\xd1\xd1\xb9H\xb6\x0e\x0f\xc3*\xb7\xef\xe7\x02GZ\xd1\xeb\xe4\xcd\xa1\x86c2k'
app.database = 'adventure_game.db'

def connect_database():
  """ Connect to app.database and return the connection object. """
  return databaseservice.connect_database(app.database)

def initialize_database():
  """ Initialize the database. """
  with app.open_resource('schema.sql') as schema:
    databaseservice.initialize_database(app.database, schema)

@app.before_request
def before_request():
  """ open dictionary/db connection"""
  database_connection = connect_database()
  database_cursor = database_connection.cursor()
  g.database_service = databaseservice.DatabaseService( \
      database_connection, database_cursor)


@app.after_request
def shutdown_session(response):
  """ Closes the dictionary/db connection after each request """
  g.database_service.close()
  return response

@app.route('/')
def index():
  """ Return the initial index template. """
  logged_in = 'user' in session
  return render_template('index.html', logged_in=logged_in)

def fail_login(message):
  """
  Tell the user that login has failed.

  Args:
    message the message to tell them

  Returns:
    A jsonified response that JavaScript will process.
  """
  return jsonify(success=False, message=message)

def success_login():
  """
  Tell the user that the login worked.

  Returns:
    A jsonified response for JavaScript.
  """
  return jsonify(success=True)

@app.route('/login', methods=['POST'])
def login():
  """
  Handle a login attempt

  Returns:
    A JSON string that JavaScript will process communicating the results
    of the login attempt.
  """
  username = request.form['username']
  password = request.form['password']
  users = Users(g.database_service)
  user = users.try_login_user(username, password)
  if user is None:
    return fail_login('Login failed. Maybe you made a typo?')
  else:
    session['user'] = user
    return success_login()

def fail_registration(message):
  """
  Tell the user that registration has failed.

  Args:
    message the message to tell them

  Returns:
    A jsonified response that JavaScript will process.
  """
  return jsonify(success=False, message=message)

def success_registration():
  """
  Tell the user that the registration worked.

  Returns:
    A jsonified response for JavaScript.
  """
  return jsonify(success=True)

@app.route('/users/new', methods=['POST'])
def add_user():
  """
  Register a user, looking up username and password in request.form.
  Validates the username and password.

  Returns:
    A JSON string about the registration status.
  """
  username = request.form['username']
  password = request.form['password']
  confirmation = request.form['confirmPassword']
  if not confirmed_password_valid(password, confirmation):
    return fail_registration(
        "Your password and confirmation didn't match up.")
  if password.strip() == '':
    return fail_registration("Passwords can not be blank.")
  if ' ' in password:
    return fail_registration("Passwords can not have spaces")
  users = Users(g.database_service)
  if not users.is_valid_username(username):
    error = """
        Username %s is not valid.
        Either it's taken, it has a space, or it's blank.
        """ % (username)
    return fail_registration(error)
  new_user = users.register_user(username, password)
  session['user'] = new_user
  return success_registration()

@app.route('/game/new', methods=['POST'])
def new_game():
  if 'user' not in session:
    return redirect(url_for('index'))
  user = session['user']
  game_builder = GameBuilder(g.database_service).for_user(user.get_id())
  # TODO Maybe programatically pick a game to play
  player_id = simple_game(game_builder)
  session['player_id'] = player_id
  game_engine = GameEngine(g.database_service, player_id)
  return jsonify(prompt=game_engine.prompt())

@app.route('/game', methods=['GET', 'POST'])
def step_game():
  if 'player_id' not in session:
    return redirect(url_for('index'))
  game_engine = GameEngine(g.database_service, session['player_id'])
  if request.method == 'GET':
    return jsonify(done=False, prompt=game_engine.prompt())
  else:
    if game_engine.game_is_over():
      return jsonify(done=True, prompt=game_engine.prompt())
    user_input = request.form['userInput']
    result = game_engine.step(user_input)
    return jsonify(done=False, prompt=result)

@app.route('/logout')
def logout():
  """ Logout a user """
  session.pop('user', None)
  return redirect(url_for('index'))

if __name__ == '__main__':
  app.run(debug=True)
