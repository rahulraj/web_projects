"""
Tipster: A Little Recommendations App

An example application written for 6170.
Copyright (c) 2011 Daniel Jackson and MIT
License: MIT
"""

import string
import time

def abbreviate(text, max_len):
    """
    Return longest prefix of text that has length max_len or less
    and does not break a word
    """
    if len(text) <= max_len:
        return text
    else:
        for i in range(max_len, 0, -1):
            if text[i] == ' ':
                break
        return text[:i]

# from: http://stackoverflow.com/questions/1551382/python-user-friendly-time-format
# DNJ: added case for FloatType
def pretty_date(time=False):
    """
    Get a datetime object or a int() Epoch timestamp and return a
    pretty string like 'an hour ago', 'Yesterday', '3 months ago',
    'just now', etc
    """
    from datetime import datetime
    from types import *
    now = datetime.now()
    if type(time) is FloatType:
        diff = now - datetime.fromtimestamp(int(time))
    elif type(time) is IntType:
        diff = now - datetime.fromtimestamp(time)
    elif isinstance(time,datetime):
        diff = now - time 
    elif not time:
        diff = now - now
    second_diff = diff.seconds
    day_diff = diff.days

    if day_diff < 0:
        return ''

    if day_diff == 0:
        if second_diff < 10:
            return "just now"
        if second_diff < 60:
            return str(second_diff) + " seconds ago"
        if second_diff < 120:
            return  "a minute ago"
        if second_diff < 3600:
            return str( second_diff / 60 ) + " minutes ago"
        if second_diff < 7200:
            return "an hour ago"
        if second_diff < 86400:
            return str( second_diff / 3600 ) + " hours ago"
    if day_diff == 1:
        return "Yesterday"
    if day_diff < 7:
        return str(day_diff) + " days ago"
    if day_diff < 31:
        return str(day_diff/7) + " weeks ago"
    if day_diff < 365:
        return str(day_diff/30) + " months ago"
    return str(day_diff/365) + " years ago"
