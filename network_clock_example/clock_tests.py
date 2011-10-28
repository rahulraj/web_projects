#!/usr/bin/python

# See http://flask.pocoo.org/docs/testing .

import os
import clock
import unittest
import tempfile
import json
import time

class FlaskrTestCase(unittest.TestCase):
  def setUp(self):
    pass
    self.app = clock.app.test_client()

  def tearDown(self):
    pass

  def test_index(self):
    rv = self.app.get("/")
    assert "<title>network clock</title>" in rv.data

  def test_get_time(self):
    request_time = "123456"
    server_time_before = int(time.time() * 1000)
    rv = self.app.get("/get_time?request_time=%s" % request_time)
    server_time_after = int(time.time() * 1000)

    jsondata = json.loads(rv.data)
    assert jsondata["request_time"] == request_time
    got_server_time = int(jsondata["server_time"]) 
    assert got_server_time > server_time_before
    assert got_server_time < server_time_after

if __name__ == '__main__':
    unittest.main()

