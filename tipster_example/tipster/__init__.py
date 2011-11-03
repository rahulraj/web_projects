"""
Tipster: A Little Recommendations App

An example application written for 6170.
Copyright (c) 2011 Daniel Jackson and MIT
License: MIT
"""

import sqlite3
import string
import time
from contextlib import closing
from flask import Flask, render_template, redirect, g, jsonify, request, url_for, session, flash
import utils
from models.Subject import Subject
from models.Review import Review
from models.User import User
from models.Category import Category
from models.DatabaseObject import DatabaseObject

DATABASE = 'tipster.db'
SCHEMA_FILE = 'schema.sql'
DEBUG = True

# max character length of review shown in abbreviated settings 
MAX_SHORT_REVIEW_LEN = 100

# max number of subjects to show in recently reviewed list
MAX_RECENTS = 5

app = Flask(__name__)
app.config.from_object(__name__)
# used to encrypt cookies
app.secret_key = "\xeb5\x97fI\x05\xd813\xa5\xf5\xd4}\x15\xb8Cfo\xd4['\x194\x11"

# adapted from http://flask.pocoo.org/snippets/8/
from functools import wraps
def access_denied():
    """Function called when access to page is denied. Redirects to login with 
    flash message explaining that login is needed, and saves return page URL
    in query string"""
    flash('To access that page, please log in first')
    # redirect to login, but pass on current path as query string
    # so that returns to previous page after login succeeds
    return redirect(url_for('login', next = request.path))

def requires_login(f):
    """Decorator to be applied to actions that require login."""
    @wraps(f)
    def decorated(*args, **kwargs):
        if not 'logged_in' in session:
          return access_denied()
        return f(*args, **kwargs)
    return decorated

def get_user_id ():
    """Helper function: if session state has user logged in, return user id, else return None"""
    if 'user_id' in session:
        return session['user_id']
    else:
        return None
    
def connect_db():
    return sqlite3.connect(app.config['DATABASE'])

# standard Flask methods to initialize database
def init_db():
    """Initialize database using script in SCHEMA_FILE."""
    with closing(connect_db()) as db:
        with app.open_resource(SCHEMA_FILE) as f:
            db.cursor().executescript(f.read())
            db.commit()

# standard Flask methods executed before after request
@app.before_request
def before_request():
    g.db = connect_db()
    g.db.row_factory = sqlite3.Row

@app.after_request
def after_request(response):
    g.db.close()
    return response

@app.route('/')
def index():
    """Show list of MAX_RECENTS most recently reviewed subjects."""
    subjects = Subject.get_recents(MAX_RECENTS)
    return render_template('index.html', subjects=subjects)

@app.route('/search', methods=['GET', 'POST'])
def search():
    """Search subjects by name and category. Reports error and returns to form if no results."""
    error = None
    if request.method == 'POST':
        subject_name = string.strip(request.form['name'])
        category_name = string.strip(request.form['category_name'])
        subjects = Subject.get_matches(subject_name, category_name)
        if not subjects:
          # no subjects found
          error = "No subjects matching those criteria"
          return render_template('search.html', error=error)
        return render_template('subjects.html', subjects=subjects)
    return render_template('search.html', error=error)

@app.route('/users/new', methods=['GET'])
def new_user ():
    """Show form for user registration."""
    return render_template('new_user.html', error=None)

@app.route('/users', methods=['POST'])
def create_user ():
    """Register new user."""
    error = None
    u = User.get_by_email(request.form['email'])
    if u is not None:
        error = 'User with that email already exists'
    else:
        u = User(request.form)
        u.save()
        return redirect(url_for('login'))
    return render_template('login.html', error=error)

@app.route('/login', methods=['GET','POST'])
def login():
    """Handles login. If query string contains url with key 'next', redirected there if login succeeds."""
    error = None
    next_url = request.args['next'] if 'next' in request.args else None
    if request.method == 'POST':
        u = User.get_by_email(request.form['email'])
        if u is not None and u.password == request.form['password']:
            session['logged_in'] = True
            session['user_id'] = u.id
            flash('Welcome back, ' + u.first)
            if next_url is not None:
                return redirect(next_url)
            else:
                return redirect(url_for('index'))
        else:
            error = 'Invalid email or password'
    # construct url for form to post to that passes on the return page url
    action_url = url_for('login', next=next_url)
    return render_template('login.html', action_url=action_url, error=error)

@app.route('/logout')
@requires_login
def logout():
    """Handles logout. Field 'logged_in' of session is dropped, by field 'user_id' is left."""
    session.pop('logged_in', None)
    user = User.get_by_id(session['user_id'])
    flash('Goodbye, ' + user.first)
    return redirect(url_for('index'))

@app.route('/subjects', methods=['GET'])
def show_subjects():
    """Displays list of all subjects"""
    subjects = Subject.get_all()
    for subject in subjects:
        subject.calculate_rating()
    return render_template('subjects.html', subjects=subjects)

@app.route('/subjects/<id>', methods=['GET'])
def show_subject(id):
    """Display subject with given id, along with all its reviews. In realistic app, should paginate."""
    subject = Subject.get_by_id(id)
    if subject is None:
      # this should only happen if URL is manually created
      flash('No such subject')
      return redirect(url_for('index'))      
    reviews = subject.get_reviews()
    if subject.by == get_user_id():
        subject.edit_url = url_for('edit_subject', id=id)
    for review in reviews:
        review.user = User.get_by_id(review.by)
        review.url = url_for('show_review', rid=review.id, sid=id)
        if review.user.id == get_user_id():
            review.edit_url = url_for('edit_review', rid=review.id, sid=id)
        abbreviated_content = utils.abbreviate(review.content, MAX_SHORT_REVIEW_LEN)
        if len(abbreviated_content) < len(review.content):
            review.more_url = review.url
            review.content = abbreviated_content
    subject.calculate_rating()
    return render_template('subject.html', subject=subject, reviews=reviews)

@app.route('/subjects/new', methods=['GET'])
@requires_login
def new_subject():
    """Show form for entering details of new subject."""
    return render_template('new_subject.html', error=None)

@app.route('/subjects', methods=['POST'])
@requires_login
def create_subject():
    """Add new subject using data from form. Error if any field is empty."""
    """If subject exists with same name and category, doesn't add."""
    """If category does not exist, adds to category set in database."""
    """Redirects if no error to page showing subject and its reviews."""
    s = Subject(request.form)
    # if name or category field is blank, then error
    error = None
    if len(s.category_name) == 0:
        error = 'Category field cannot be empty'
    if len(s.name) == 0:
        error = 'Name field cannot be empty'
    if error:
        return render_template('new_subject.html', error=error)        
    
    s.by = session['user_id']

    # if subject exists with this name and category
    # don't add, but go to reviews page for this subject
    subject_id = Subject.get_by_name_and_category(s.name, s.category_name)
    if subject_id != None:
        flash('Subject exists')
        return redirect(url_for('show_subject', id=subject_id))
    
    # find category with given name or create if not exists
    category_name = request.form['category_name']
    category = Category.get_by_name(category_name)
    # if category doesn't exist, create it
    if category == None:
        category = Category(dict(name=category_name))
        category.save()
    s.category = category.id
    subject_id = s.save()
    flash('Subject successfully added')  
    return redirect(url_for('show_subject', id=subject_id))

@app.route('/subjects/<id>/edit', methods=['GET'])
@requires_login
def edit_subject (id):
    """Show form for editing details of subject."""
    subject = Subject.get_by_id(id)
    return render_template('edit_subject.html', subject=subject)

@app.route('/subjects/<id>', methods=['POST'])
@requires_login
def update_subject (id):
    """Update details of subject using results from form submission.
    Would be better to use PUT method, since this action is idempotent, but HTML forms only allow
    GET and POST."""
    subject = Subject.get_by_id(id)
    subject.update(request.form)
    return redirect(url_for('show_subject', id=id))

# Note: review ids are actually unique, so subject id is not strictly necessary here.
# But prefer this more consistent ReSTful naming scheme.
@app.route('/subjects/<sid>/reviews/<rid>', methods=['GET'])
def show_review (sid, rid):
    """Display review rid of subject sid in full."""
    review = Review.get_by_id(rid)
    if review is None:
      # this should only happen if URL is manually created
      flash('No such review')
      return redirect(url_for('index'))      
    review.user = User.get_by_id(review.by)
    if review.user.id == get_user_id():
        review.edit_url = url_for('edit_review', rid=rid, sid=sid)
    subject = Subject.get_by_id(sid)
    return render_template('review.html', subject=subject, review=review)

@app.route('/subjects/<id>/reviews/new', methods=['GET'])
@requires_login
def new_review (id):
    """Display form for entering new review."""
    subject = Subject.get_by_id(id)
    return render_template('new_review.html', subject=subject)

@app.route('/subjects/<id>/reviews', methods=['POST'])
@requires_login
def create_review (id):
    """Add new review, associate with current user, and set created time to now."""
    r = Review(request.form)
    r.created = time.time()
    r.about = id
    r.by = session['user_id']
    r.save()
    return redirect(url_for('show_subject', id=id))

@app.route('/subjects/<sid>/reviews/<rid>/edit', methods=['GET'])
@requires_login
def edit_review (sid, rid):
    """Display form for editing review rid of subject sid."""
    review = Review.get_by_id(rid)
    review.user = User.get_by_id(review.by)
    subject = Subject.get_by_id(sid)
    return render_template('edit_review.html', subject=subject, review=review)

@app.route('/subjects/<sid>/reviews/<rid>', methods=['POST'])
def update_review (sid, rid):
    """Update review rid of subject sid using submitted form data.
    Note that date of review is not updated, since it's set once at creation, which is not ideal.
    Would be better to use PUT method, since this action is idempotent, but HTML forms only allow
    GET and POST."""
    review = Review.get_by_id(rid)
    review.created = time.time()
    review.update(request.form)
    return redirect(url_for('show_subject', id=sid))

@app.route('/get_category_suggestions')
def get_category_suggestions():
    """For autocompletion.
    Takes the string value associated with the key 'term' in the request
    and returns a JSON object with field 'suggestions'
    that contains an array of strings corresponding to category names
    in the database that include the term as a substring."""
    term = request.args['term']
    matches = Category.get_strings_like('name',term)    
    return jsonify(suggestions = matches)

@app.route('/get_subject_suggestions')
def get_subject_suggestions():
    """For autocompletion.
    Takes the string value associated with the key 'term' in the request
    and returns a JSON object with field 'suggestions'
    that contains an array of strings corresponding to subject names
    in the database that include the term as a substring."""
    term = request.args['term']
    matches = Subject.get_strings_like('name', term)    
    return jsonify(suggestions = matches)