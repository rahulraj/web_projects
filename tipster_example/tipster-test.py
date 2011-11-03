"""
Tipster: A Little Recommendations App

Sample test cases.
Copyright (c) 2011 Daniel Jackson and MIT
License: MIT

These are pretty crude tests, since they look
for particular strings in the output. They
also do not achieve coverage.

Tests are organized in a class hierarchy so that
the setup can be incrementally grown:

A_BasisTestCase: sets up condition A
B_BasisTestCase(A_BasisTestCase): sets up condition A and B
C_BasisTestCase(B_BasisTestCase): sets up condition A and B and C

The actual test cases are placed to the side in the hierarchy
in classes whose names don't include "Basis". Thus

A_TestCase(A_BasisTestCase): test case that uses setup of A_BasisTestCase
"""

import os
import unittest
import tempfile
import tipster

# see http://flask.pocoo.org/docs/testing/ for more examples of testing Flask apps

class TipsterBasisTestCase(unittest.TestCase):

    def setUp(self):
        """Initialize database in temporary file"""
        self.db_fd, tipster.app.config['DATABASE'] = tempfile.mkstemp()
        tipster.app.config['TESTING'] = True
        self.app = tipster.app.test_client()
        tipster.init_db()

    def tearDown(self):
        """Close database"""
        os.close(self.db_fd)
        os.unlink(tipster.app.config['DATABASE'])

class TipsterLoginBasisTestCase(TipsterBasisTestCase):

    def register(self, first, last, email, password):
        return self.app.post('/users', data=dict(
            first=first,
            last=last,
            email=email,
            password=password
        ), follow_redirects=True)

    def login(self, email, password):
        return self.app.post('/login', data=dict(
            email=email,
            password=password
        ), follow_redirects=True)

    def logout(self):
        return self.app.get('/logout', follow_redirects=True)

    def setUp(self):
        """login a sample user"""
        TipsterBasisTestCase.setUp(self)
        first = 'Chloe'
        last = 'Closure'
        email = 'cc@mit.edu'
        password = 'ccpass'
        rv = self.register(first, last, email, password)
        rv = self.login(email, password)

class TipsterLoginTestCase(TipsterLoginBasisTestCase):

    def test_register_login_logout(self):
        first = 'Chloe'
        last = 'Closure'
        email = 'cc@mit.edu'
        password = 'ccpass'
        rv = self.register(first, last, email, password)
        rv = self.login(email, password)
        assert 'Welcome back' in rv.data
        assert first in rv.data
        rv = self.logout()
        assert 'Goodbye' in rv.data
        assert first in rv.data
    
class TipsterAddSubjectBasisTestCase(TipsterLoginBasisTestCase):

    def setUp(self):
        """Add a sample subject"""
        TipsterLoginBasisTestCase.setUp(self)
        name = "Peets Coffee"
        category = "Coffee Shops"
        rv = self.app.post('/subjects',data=dict(
            name=name,
            category_name=category
        ), follow_redirects=True)
        name = "Home Depot"
        category = "Hardware"
        rv = self.app.post('/subjects',data=dict(
            name=name,
            category_name=category
        ), follow_redirects=True)

class TipsterAddSubjectTestCase(TipsterAddSubjectBasisTestCase):

    def test_add_Subject(self):
        # assume id of 1 assigned to new Subject
        rv = self.app.get('/subjects/1', follow_redirects=True)
        assert "Peets Coffee" in rv.data
        rv = self.app.get('/subjects/2', follow_redirects=True)
        assert "Home Depot" in rv.data

    def test_edit_subject(self):
        rv = self.app.post('/subjects/1',data=dict(
            name="Peet Coffee Shop",
            category_name="Coffee Shops"
        ), follow_redirects=True)
        # check name of edited subject
        rv = self.app.get('/subjects/1', follow_redirects=True)
        assert "Peet Coffee Shop" in rv.data

class TipsterAddEditReviewBasisTestCase(TipsterAddSubjectBasisTestCase):

    def setUp(self):
        """Add two sample reviews, one that exceeds minimum abbreviation length"""
        TipsterAddSubjectBasisTestCase.setUp(self)
        rating = 5
        content = '''Great place! Make a long review that uses more than
        the number of characters that forces an abbreviation and the
        the number of characters that forces an abbreviation and the
        the number of characters that forces an abbreviation and the
        the number of characters that forces an abbreviation and the
        the number of characters that forces an abbreviation and the
        the number of characters that forces an abbreviation and the
        the number of characters that forces an abbreviation and the
        the number of characters that forces an abbreviation and the
        creation of a more link'''
        rv = self.app.post('/subjects/1/reviews',data=dict(
            rating=rating,
            content=content
        ), follow_redirects=True)
        rating = 3
        content = '''Great place! A short review this time'''
        rv = self.app.post('/subjects/1/reviews',data=dict(
            rating=rating,
            content=content
        ), follow_redirects=True)

class TipsterAddEditReviewTestCase(TipsterAddEditReviewBasisTestCase):

    def test_add_reviews(self):
        # check text of first review
        rv = self.app.get('/subjects/1/reviews/1', follow_redirects=True)
        assert "Great place" in rv.data
        # check text of second review
        rv = self.app.get('/subjects/1/reviews/2', follow_redirects=True)
        assert "short review" in rv.data
        # check average rating
        rv = self.app.get('/subjects/1', follow_redirects=True)
        assert "(4.0)" in rv.data

    def test_edit_review(self):
        rv = self.app.post('/subjects/1/reviews/1',data=dict(
            rating=1,
            content="New content"
        ), follow_redirects=True)
        # check text of edited review
        rv = self.app.get('/subjects/1/reviews/1', follow_redirects=True)
        assert "New content" in rv.data

    def test_more_link(self):
        # check text of first review contains truncated text on review page
        rv = self.app.get('/subjects/1/reviews/1', follow_redirects=True)
        assert "creation" in rv.data
        # ... but not on subject page
        rv = self.app.get('/subjects/1', follow_redirects=True)
        assert "Great place" in rv.data
        assert '<a href="/subjects/1/reviews/1" class=morelink>more</a>' in rv.data
        assert '<a href="/subjects/1/reviews/2" class=morelink>more</a>' not in rv.data
        assert "creation" not in rv.data

class TipsterSearchTestCase(TipsterAddSubjectBasisTestCase):

    def test_search_subject_by_name(self):
        # include leading and trailing spaces to check that they are ignored
        rv = self.app.post('/search',data=dict(
            name="  Peets ",
            category_name=""
        ), follow_redirects=True)
        assert "Peets Coffee" in rv.data
        assert "Home Depot" not in rv.data

    def test_search_subject_by_category(self):
        rv = self.app.post('/search',data=dict(
            name="",
            category_name="Hardware"
        ), follow_redirects=True)
        assert "Peets Coffee" not in rv.data
        assert "Home Depot"  in rv.data

    def test_search_subject_empty(self):
        rv = self.app.post('/search',data=dict(
            name="",
            category_name=""
        ), follow_redirects=True)
        assert "Peets Coffee" in rv.data
        assert "Home Depot" in rv.data

class TipsterAjaxCallsTestCase(TipsterAddSubjectBasisTestCase):

    def test_suggest_categories(self):
        rv = self.app.get('/get_category_suggestions' + '?term=Ha', follow_redirects=True)
        assert 'suggestions' in rv.data
        assert 'Hardware' in rv.data
        assert 'Food' not in rv.data
        rv = self.app.get('/get_category_suggestions' + '?term=e', follow_redirects=True)
        assert 'suggestions' in rv.data
        assert 'Hardware' in rv.data
        assert 'Coffee Shops' in rv.data

    def test_suggest_subjects(self):
        rv = self.app.get('/get_subject_suggestions' + '?term=pe', follow_redirects=True)
        assert 'suggestions' in rv.data
        assert 'Peets' in rv.data
        rv = self.app.get('/get_subject_suggestions' + '?term=Depot', follow_redirects=True)
        assert 'suggestions' in rv.data
        assert 'Home Depot' in rv.data        
        
if __name__ == '__main__':
    unittest.main()