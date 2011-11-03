"""
Tipster: A Little Recommendations App

An example application written for 6170.
Copyright (c) 2011 Daniel Jackson and MIT
License: MIT
"""

from flask import g, session, request
from DatabaseObject import DatabaseObject
import time
from .. import utils

class User(DatabaseObject):

    TABLE_NAME = 'users'
    COLUMNS = ['first', 'last', 'email', 'password']
    FROM_TRANSFORMS = {'since': utils.pretty_date}
    TO_TRANSFORMS = {}

    @staticmethod
    def get_by_email(email):
        """Return first user with given email address or None if no such user"""
        cur = g.db.execute('''select * from users where users.email = ?''', [email])
        row = cur.fetchone()
        if row == None:
            return None
        else:
            return User(row)