
from flask import Flask, g, request, render_template, redirect, url_for,jsonify, json

app = Flask(__name__)
app.config.from_object(__name__)

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

