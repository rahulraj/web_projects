#!/usr/bin/env python
"""
Initialize the database.

NOTE:
  The location of the database depends on how the application is run.
  It should be accessible from the same path as the script that kicks
  off the application.
  That is, if you run the application by executing
  python __init__.py
  the database should be in advgame/ because __init__.py is there.

  On scripts.mit.edu, the application is called by index.fcgi which
  lives in the directory above advgame/
  In that case the database file should also be in that directory.
  (scripts.mit.edu has already been set up this way)

  There's copies of this script in both directories. Run the one
  inside the directory that the database should be in.
"""
import __init__ as advgame

if __name__ == '__main__':
  advgame.initialize_database()
