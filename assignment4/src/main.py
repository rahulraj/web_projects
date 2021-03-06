import os
import shelve
from flask import Flask, render_template, request, flash, redirect, url_for, session, abort
from users import Users, confirmed_password_valid
from closing import closing

app = Flask(__name__)
users_file = 'users'

def zwrite(msg):
    """use this for printline debugging"""
    try:
        os.system("zwrite -d -c afarrell-dbg -i flask -m '%s'" % msg)
    except Exception:
        os.system("zwrite -d -c afarrell-dbg -i flask -m 'ZWRITE ERROR'")
        os.system("zwrite -d -c afarrell-dbg -i flask -m '%s'" % msg)


@app.route('/')
def index():
  """ Simply displays the landing page. """
  return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
  """
  Sending a GET request gets the login form page.
  Sending a POST request tries to logs in the user.
  """
  if request.method == 'GET':
    return render_template('login.html')
  else:
    username = request.form['username']
    password = request.form['password']
    with closing(shelve.open(users_file)) as user_shelf:
      users = Users(user_shelf)
      if users.login_is_valid(username, password):
        session['username'] = username
        return redirect(url_for('notes'))
    flash('Login failed. Maybe you made a typo?')
    return render_template('login.html')

def fail_registration(message):
  """ 
  Helper function to handle a request that failed for some reason.
  Args:
   message the error message to flash
  """
  flash(message)
  return render_template('register.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
  """
  Sending a GET request returns the register.html page.
  Sending a POST request validates, then registers the user.
  If successful, the user is immediately brought to the sticky note page.
  """
  if request.method == 'GET':
    return render_template('register.html')
  else:
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
    with closing(shelve.open(users_file)) as user_shelf:
      users = Users(user_shelf)
      if not users.is_valid_user(username):
        flash("Username %s is not valid." % (username))
        flash("Either it's taken, it has a space, or it's blank")
        return render_template('register.html')
      users.register_user(username, password)
      session['username'] = username
    return redirect(url_for('notes'))

@app.route('/notes')
def notes():
  """
  Notes page, users can organize notes here.
  JavaScript does most of the processing.
  """
  if 'username' not in session:
    return redirect(url_for('login'))
  storage_url = url_for('notes_storage')
  return render_template('notes.html', 
      username=session['username'], storage_url=storage_url)

@app.route('/notes-storage', methods=['GET', 'POST'])
def notes_storage():
  """
  Sending a GET request to this URL retrieves the notes associated with
  the user logged in (checked via the session).
  
  Sending a POST request updates the shelf with the provided new values.

  JavaScript calls this function to save/load notes.
  """
  if 'username' not in session:
    abort(401)

  with closing(shelve.open(users_file)) as user_shelf:
    users = Users(user_shelf)
    if request.method == 'GET':
      return users.stickies_for_user(session['username'])
    else:
      data = request.form['noteSet']
      users.save_stickies_for_user(session['username'], data)
      return 'Post successful'

@app.route('/logout')
def logout():
  """
  Log the user out.
  """
  session.pop('username', None)
  return redirect(url_for('login'))


app.secret_key = \
    '\x1e\xa7\xfafD\xc4A\x15\xdf\xf4v\x17\x97\x19\xc2m\xfew\xfd\xbfip+\x9f'

if __name__ == '__main__':
  app.run(debug=True)

