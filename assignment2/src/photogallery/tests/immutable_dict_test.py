import unittest
from ..utils.immutabledict import ImmutableDict, DisallowedModification

class ImmutableDictTest(unittest.TestCase):
  def setUp(self):
    self.test_dict = ImmutableDict({'foo': 'bar'})

  def test_setting_values_should_throw_an_exception(self):
    try:
      self.test_dict['foo'] = 'new_value'
      self.fail()
    except DisallowedModification:
      pass
    self.assertEquals('bar', self.test_dict['foo'])

  def test_adding_new_values_should_throw_an_exception(self):
    try:
      self.test_dict['baz'] = 'new_value'
      self.fail()
    except DisallowedModification:
      pass
    self.assertTrue('baz' not in self.test_dict)

if __name__ == '__main__':
  unittest.main()
