"""
Tipster: A Little Recommendations App

An example application written for 6170.
Copyright (c) 2011 Daniel Jackson and MIT
License: MIT
"""

from flask import g

class DatabaseObject(object):
    """
    This class implements a kind of baby object relational mapper.
    There is a class that extends this class for each concrete entity,
    which defines four constants:
    
    TABLE_NAME: the name of the table
    COLUMNS: the names of the entity fields to be stored as columns in the database
    FROM_TRANSFORMS: a dictionary that maps column names to functions that are applied
      when values are extracted from the database
    TO_TRANSFORMS: a dictionary that maps column names to functions that are applied
      when values are written to the database

    The same constructor is used to make objects from forms, and to make objects
    from database tuples. The dictionaries given as args to the constructor are:
        request.form with from_db false; excludes id
        database row with from_db true; includes id        
    """

    @classmethod
    def insert_string(_class):
        """Returns the SQL command for inserting an object into the database table."""
        return ('insert into ' + _class.TABLE_NAME
                + '(' + ', '.join(_class.COLUMNS)
                + ') values (' + ','.join(len(_class.COLUMNS) * ['?']) + ')')

    @classmethod    
    def update_string(_class, d):
        """Returns the SQL command for updating all columns that are keys in dictionary d"""
        return ('update ' + _class.TABLE_NAME
                + ' set ' + ', '.join(map(lambda colname: (colname + " = ?"), d.keys()))
                + ' where id = ?')

    def transform(self, key, val, from_db):
        """Returns the transformed version of val using FROM_TRANSFORMS or TO_TRANSFORMS
        according to whether from_db is true or false."""
        c = self.__class__
        transforms = c.FROM_TRANSFORMS if from_db else c.TO_TRANSFORMS
        if key in transforms.keys():
            return transforms[key](val)
        else:
            return val

    def __init__(self, d, from_db=False):
        """Initialize object from dictonary d, creating a field for each key of d."""
        for k in d.keys():
            self.__dict__[k] = self.transform(k, d[k], from_db)
                
    def save(self):
        """Save the object to the database."""
        cur = g.db.cursor()
        cur.execute(self.__class__.insert_string(), [self.__dict__[k] for k in self.__class__.COLUMNS])
        id = cur.lastrowid
        g.db.commit()
        self.id = id
        return id

    def update(self, d):
        """Update the object in the database using the key/value mapping in dictionary d.
        Not every column name need appear as a key of d; omitted column names are not affected."""
        cur = g.db.cursor()
        values = [d[k] for k in d.keys()]
        values.append(self.id)
        cur.execute(self.__class__.update_string(d), values)
        g.db.commit()
        return

    @classmethod
    def get_all(_class):
        """Return a list containing every object in the class."""
        cur = g.db.execute('select * from %s' % _class.TABLE_NAME)
        objects = []
        for row in cur.fetchall():
            objects.append(_class(row, from_db=True))
        return objects

    @classmethod
    def get_by_id(_class, id):
        """Return the object with given id. Assumes such object exists."""
        cur = g.db.execute('select * from %s where id = ?' % _class.TABLE_NAME, [id])
        row = cur.fetchone()
        return _class(row, from_db=True)

    @classmethod
    def get_strings_like(_class, column, s):
        """Return array of strings from given column that contain the substring s."""
        cur = g.db.execute('select %s from %s where name LIKE ?' % (column, _class.TABLE_NAME),  ["%" + s + "%"])
        strings = []
        for row in cur.fetchall():
            strings.append(row[0])
        return strings