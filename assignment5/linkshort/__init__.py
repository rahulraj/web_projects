import time
from flask import Flask, request, g, render_template, session, jsonify, abort, redirect, url_for
from users import confirmed_password_valid, Users
from shortener import create_url_shortener
import databaseservice

app = Flask(__name__)
app.config.from_object(__name__)

app.secret_key = \
  '\x8bj\xcaa\x82\x8e\xd1\xcb\x82\x8b\xdc\x93-\xa3\x0e\x12\x83=\x82xo\x8c\xe3A'
app.database = 'link_shortener.db'

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
  return render_template('index.html', root_url=request.url_root)

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

@app.route('/register', methods=['POST'])
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

def get_pages_by_user(user):
  """
  Retrieve the Pages created by a user

  Args:
    user the user.

  Returns:
    A JSON object containing the pages, converted to data format.
  """
  pages = g.database_service.find_pages_by_user(user)
  def page_to_dict(page):
    visits = g.database_service.find_visits_of_page(page)
    return page.as_dict(visits)
  page_dicts = map(page_to_dict, pages)
  return jsonify(pages=page_dicts)

def post_pages_by_user(user):
  """
  Add a page for a user
  
  Args:
    user the user.

  Returns:
    A JSON object informing the user whether or not it succeeded.
  """
  reserved_urls = ('login', 'register', 'pages', 'logout')
  make_short_url = create_url_shortener(g.database_service)
  url_to_shorten = request.form['originalUrl']
  if url_to_shorten.strip() == '':
    return jsonify(success=False, message="URL is blank")
  if url_to_shorten.startswith('http://'):
    # Don't store the protocol in the database, if it was specified.
    # This avoids client-side postprocessing later.
    url_to_shorten = url_to_shorten[len('http://'):]
  output_url = request.form['outputUrl']
  if output_url.strip() == '':
    shortened_url = make_short_url()
    while shortened_url in reserved_urls:
      # Unlikely, but we should try to stay safe
      shortened_url = make_short_url()
  elif output_url in reserved_urls or \
       g.database_service.try_get_shortened_url(output_url) is not None:
    return jsonify(success=False, message='URL is taken')
  else:
    shortened_url = output_url
  # Now store the shortened URL
  g.database_service.add_page_for_user(user, url_to_shorten, shortened_url)
  return jsonify(success=True, shortenedUrl=shortened_url)

@app.route('/pages', methods=['GET', 'POST'])
def pages_by_user():
  """
  The user whose pages to access should be in the session.
  Sending a GET request to this URL retrieves the pages,
  and sending a POST request adds another page.
  """
  if 'user' not in session:
    abort(401)
  user = session['user']
  if request.method == 'GET':
    return get_pages_by_user(user)
  else:
    return post_pages_by_user(user)

@app.route('/<shortened_url>')
def access_short_url(shortened_url):
  """
  Try to lookup a shortened URL.

  Args:
    shortened_url the URL.

  Returns:
    A redirect to the expanded page if the URL is correct,
    or the page-not-found template if it was incorrect.
  """
  page = g.database_service.try_get_shortened_url(shortened_url)
  if page is None:  
    return render_template('page-not-found.html', tried_url=shortened_url)
  original_url = page.get_original_url()
  if not original_url.startswith('http://'):
    destination = 'http://' + original_url 
  else:
    destination = original_url
  visit_time = int(time.time())
  g.database_service.add_visit_for_page(page, visit_time)
  return redirect(destination)

@app.route('/logout')
def logout():
  """ Logout a user """
  session.pop('user', None)
  return redirect(url_for('index'))

if __name__ == '__main__':
  app.run(debug=True)
