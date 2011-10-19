import os
from flask import Flask, render_template, request
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
    return "You've posted, but this feature isn't implemented yet"

@app.route('/register', methods=['GET', 'POST'])
def register():
  if request.method == 'GET':
    return render_template('register.html')
  else:
    return "You've posted, but not implemented yet"

@app.route('/notes')
def notes():
  
  pass

if __name__ == '__main__':
  app.run(debug=True)

app.secret_key = \
    '\x1e\xa7\xfafD\xc4A\x15\xdf\xf4v\x17\x97\x19\xc2m\xfew\xfd\xbfip+\x9f'
