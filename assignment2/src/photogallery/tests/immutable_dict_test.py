import unittest
from ..utils.immutabledict import ImmutableDict, DisallowedModification

class ImmutableDictNamedConstructorTest(unittest.TestCase):
  def test_construct_immutable_dict(self):
    my_dict = ImmutableDict.of(foo='bar', baz='quux')
    self.assertEquals('bar', my_dict['foo'])
    self.assertEquals('quux', my_dict['baz'])

class ImmutableDictModificationTest(unittest.TestCase):
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

  def test_pop_should_throw_an_exception(self):
    try:
      self.test_dict.pop('foo')
      self.fail()
    except DisallowedModification:
      pass
    self.assertTrue('foo' in self.test_dict)

  def test_popitem_should_throw_an_exception(self):
    try:
      self.test_dict.popitem()
      self.fail()
    except DisallowedModification:
      pass
    self.assertTrue('foo' in self.test_dict)

  def test_setdefault_should_throw_an_exception(self):
    try:
      self.test_dict.setdefault('baz', 'quux')
      self.fail()
    except DisallowedModification:
      pass
    self.assertTrue('baz' not in self.test_dict)

  def test_update_should_throw_an_exception(self):
    try:
      self.test_dict.update(baz='quux')
      self.fail()
    except DisallowedModification:
      pass
    self.assertTrue('baz' not in self.test_dict)

if __name__ == '__main__':
  unittest.main()
