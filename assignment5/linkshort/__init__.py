from contextlib import closing
import sqlite3
from flask import Flask

app = Flask(__name__)
app.config.from_object(__name__)

app.secret_key = \
  '\x8bj\xcaa\x82\x8e\xd1\xcb\x82\x8b\xdc\x93-\xa3\x0e\x12\x83=\x82xo\x8c\xe3A'
app.database = 'link_shortener.db'

def connect_database():
  return sqlite3.connect(app.database)

def initialize_database():
  with closing(connect_database()) as database:
    with app.open_resource('schema.sql') as schema:
      database.cursor().executescript(schema.read())
    database.commit()


@app.before_request
def before_request():
    """ open dictionary/db connection"""


@app.after_request
def shutdown_session(response):
    """ Closes the dictionary/db connection after each request """
    return response

@app.route('/')
def index():
    return "Hello World! I'm a flask example."

