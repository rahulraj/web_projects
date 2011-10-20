""" 
Using contextlib.closing to backport compatibility with the
'with' statement to the shelve module. This is not needed in
Python 2.7 and newer.

This code is from
http://docs.python.org/library/contextlib.html#contextlib.closing
"""
from contextlib import contextmanager

@contextmanager
def closing(thing):
  try:
    yield thing
  finally:
    thing.close()
