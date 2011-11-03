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

class Review(DatabaseObject):

    TABLE_NAME = 'reviews'
    COLUMNS = ['created', 'by', 'about', 'content', 'rating']
    FROM_TRANSFORMS = {
        # when review is extracted from database, convert date from Unix time to pretty printed format
        'created': utils.pretty_date
    }
    TO_TRANSFORMS = {}