import os
import shelve
from flask import Flask, render_template, request, flash, redirect, url_for
from users import Users, confirmed_password_valid
app = Flask(__name__)

def zwrite(msg):
    """use this for printline debugging"""
    try:
        os.system("zwrite -d -c afarrell-dbg -i flask -m '%s'" % msg)
    except Exception:
        os.system("zwrite -d -c afarrell-dbg -i flask -m 'ZWRITE ERROR'")
        os.system("zwrite -d -c afarrell-dbg -i flask -m '%s'" % msg)

@app.route('/')
@app.route('/login', methods=['GET', 'POST'])
def login():
  if request.method == 'GET':
    return render_template('login.html')
  else:
    username = request.form['username']
    password = request.form['password']
    with shelve.open('users') as user_shelf:
      users = Users(user_shelf)
      if users.login_is_valid(username, password):
        return redirect(url_for('notes'))
    flash('Login failed. Maybe you made a typo?')
    return render_template('login.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
  if request.method == 'GET':
    return render_template('register.html')
  else:
    username = request.form['username']
    password = request.form['password']
    confirmation = request.form['confirmPassword']
    if not confirmed_password_valid(password, confirmation):
      flash("Your password and confirmation didn't match up.")
      return render_template('register.html')
    with shelve.open('users') as user_shelf:
      with shelve.open('user_salts') as salt_shelf:
        users = Users(user_shelf, salt_shelf)
        if users.has_user(username):
          flash("Username %s has already been taken." % (username))
          return render_template('register.html')
        users.register_user(username, password)
    return redirect(url_for('notes'))

@app.route('/notes')
def notes():
  return render_template('notes.html')

if __name__ == '__main__':
  app.run(debug=True)

app.secret_key = \
    '\x1e\xa7\xfafD\xc4A\x15\xdf\xf4v\x17\x97\x19\xc2m\xfew\xfd\xbfip+\x9f'
