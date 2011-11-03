"""
Tipster: A Little Recommendations App

An example application written for 6170.
Copyright (c) 2011 Daniel Jackson and MIT
License: MIT
"""

from tipster import app, init_db
init_db()
app.run(debug=True)
