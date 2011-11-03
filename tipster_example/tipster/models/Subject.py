"""
Tipster: A Little Recommendations App

An example application written for 6170.
Copyright (c) 2011 Daniel Jackson and MIT
License: MIT
"""

from flask import g, session, request
from DatabaseObject import DatabaseObject
from Review import Review
from string import strip

class Subject(DatabaseObject):

    TABLE_NAME = 'subjects'
    COLUMNS = ['name', 'category', 'category_name', 'by']
    FROM_TRANSFORMS = {}
    
    # strip leading and trailing spaces off some form fields before storing in database
    TO_TRANSFORMS = {'name': strip, 'category_name': strip}
    
    def get_reviews(self):
        cur = g.db.execute('select * from reviews where about = ?', [self.id])
        reviews = []
        for row in cur.fetchall():
            reviews.append(Review(row, from_db=True))
        return reviews

    @classmethod
    def get_by_name_and_category(_class, subject_name, category_name):
        """Return id of subject with this name and category name, or None if no such"""
        cur = g.db.execute('select id from subjects where name = ? and category_name = ?', [subject_name, category_name])
        row = cur.fetchone()
        if row is None:
          return None
        else:
          return row[0]

    @classmethod
    def get_recents(_class, max):
        """Return up to max most recently reviewed subjects, as objects not ids"""
        cur = g.db.execute('select distinct subjects.* from subjects, reviews where reviews.about = subjects.id order by reviews.created desc')
        subjects = []
        count = 0
        for row in cur.fetchall():
            if count == max:
              break
            count = count + 1
            subjects.append(Subject(row, from_db=True))
        return subjects

    def calculate_rating(self):
        """
        Set avg_rating and rounded_rating fields, as follows:
        Take average of all ratings r.rating of reviews r in self.get_reviews()
        ignoring reviews for which r.rating is zero (taken as no rating)
        Then avg_rating is set to the average rounded to one decimal place
        and rounded_rating is set to the average rounded to the nearest int
        Neither is set if there are no reviews with ratings
        """
        sum = 0.0
        count = 0
        for review in self.get_reviews():
            if review.rating != 0:
                count = count + 1
                sum = sum + review.rating
        # set average rating field only if there are some ratings
        if count > 0:
            average_rating = sum/count
            self.avg_rating = "%.1f" % average_rating
            self.rounded_rating = int(round(average_rating))

    @classmethod
    def get_matches(_class, subject_name, category_name):
        """
        Return array of subjects where name has subject_name as a substring
          and category name has category_name as a substring
        Note that empty name acts as wildcard
        """
        cur = g.db.execute('select * from subjects where name like ? and category_name like ?',  ["%" + subject_name + "%", "%" + category_name + "%"])
        subjects = []
        for row in cur.fetchall():
            subjects.append(Subject(row))
        return subjects
