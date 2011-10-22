import time
from flask import Flask, jsonify, request

DEBUG = True
app = Flask(__name__)
app.config.from_object(__name__)

@app.route('/status')
def get_status():
	delay(2)
	return "status: UP"

@app.route('/json_status')
def get_json_status():
	return jsonify(status = 'UP', time ='2pm')

@app.route('/suggestions')
def get_suggestions():
	return jsonify(suggestions = ['apple', 'banana', 'pear'])

@app.route('/debug')
def get_debug():
	return "Sorry! This app has failed catastrophically and it's all YOUR fault!"

@app.route('/welcome')
def welcome():
    user = request.args['user']
    return "Welcome, " + user;

@app.route('/dollars2euros')
def d2e():
    d = request.args['dollars']
    return str(float(d) * 0.72)

@app.route('/euros2pesos')
def e2p():
    e = request.args['euros']
    return str(float(e) * 1.36)


# produce delay of t seconds
def delay(t):
	time.sleep(t)
