"""
Tipster: A Little Recommendations App

An example application written for 6170.
Copyright (c) 2011 Daniel Jackson and MIT
License: MIT
"""

from flask import g, session, request
from DatabaseObject import DatabaseObject

class Category(DatabaseObject):

    TABLE_NAME = 'categories'
    COLUMNS = ['name']
    FROM_TRANSFORMS = {}
    TO_TRANSFORMS = {}
    
    @classmethod
    def get_by_name(_class, category_name):
        """Return category with this name, or None if no such category"""
        cur = g.db.execute('select id from categories where name = ?', [category_name])
        row = cur.fetchone()
        if row == None:
            return None
        else:
            return Category(row)