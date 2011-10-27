from flask import Flask, request, g, render_template, session
from users import confirmed_password_valid, Users
import databaseservice

app = Flask(__name__)
app.config.from_object(__name__)

app.secret_key = \
  '\x8bj\xcaa\x82\x8e\xd1\xcb\x82\x8b\xdc\x93-\xa3\x0e\x12\x83=\x82xo\x8c\xe3A'
app.database = 'link_shortener.db'

def connect_database():
  return databaseservice.connect_database(app.database)

def initialize_database():
  with app.open_resource('schema.sql') as schema:
    databaseservice.initialize_database(app.database, schema)

@app.before_request
def before_request():
  """ open dictionary/db connection"""
  g.database = connect_database()

@app.after_request
def shutdown_session(response):
  """ Closes the dictionary/db connection after each request """
  g.database.close()
  return response

@app.route('/')
def index():
  return render_template('index.html')

def fail_registration(message):
  """ TODO Determine how to communicate failures to the client. """
  pass

def success_registration():
  pass

@app.route('/register', methods=['POST'])
def add_user():
  username = request.form['username']
  password = request.form['password']
  confirmation = request.form['confirmPassword']
  if not confirmed_password_valid(password, confirmation):
    return fail_registration(
        "Your password and confirmation didn't match up.")
  if len(password) == 0:
    return fail_registration("Passwords can not be blank.")
  if ' ' in password:
    return fail_registration("Passwords can not have spaces")
  database_service = databaseservice.DatabaseService(g.database)
  users = Users(database_service)
  if not users.is_valid_user(username):
    error = """
        Username %s is not valid.
        Either it's taken, it has a space, or it's blank.
        """ % (username)
    return fail_registration(error)
  users.register_user(username, password)
  session['username'] = username
  return success_registration()

@app.route('/<shortened_url>')
def access_short_url(shortened_url):
  return render_template('page-not-found.html', tried_url=shortened_url)

if __name__ == '__main__':
  app.run(debug=True)
