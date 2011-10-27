from flask import Flask, g, render_template
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

@app.route('/<shortened_url>')
def access_short_url(shortened_url):
  return render_template('page-not-found.html', tried_url=shortened_url)

if __name__ == '__main__':
  app.run(debug=True)
