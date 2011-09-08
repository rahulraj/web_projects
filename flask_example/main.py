from flask import Flask, request
import os
app = Flask(__name__)

def zwrite(msg):
    """use this for printline debugging"""
    try:
        os.system("zwrite -d -c afarrell-dbg -i flask -m '%s'" % msg)
    except Exception,e:
        os.system("zwrite -d -c afarrell-dbg -i flask -m 'ZWRITE ERROR'")
        os.system("zwrite -d -c afarrell-dbg -i flask -m '%s'" % msg)

@app.route('/index.html')
@app.route('/')
def hello_world():
    zwrite("request passed to test flask " + request.path)
    return "Hello World! I'm a flask example."

if __name__ == '__main__':
    app.run()
