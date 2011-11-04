from flask import Flask, g, request, render_template, redirect, url_for,jsonify, json
import databaseservice

app = Flask(__name__)
app.config.from_object(__name__)
app.secret_key = \
    '\xd1\xd1\xb9H\xb6\x0e\x0f\xc3*\xb7\xef\xe7\x02GZ\xd1\xeb\xe4\xcd\xa1\x86c2k'
app.database = 'adventure_game.db'

def initialize_database():
  """ Initialize the database. """
  with app.open_resource('schema.sql') as schema:
    databaseservice.initialize_database(app.database, schema)

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

