import unittest
from ..utils.getters import with_getters_for

class TestWithGettersFor(unittest.TestCase):
  def test_should_add_getters_to_the_given_class_for_the_given_var_names(self):
    class MyClass(object):
      def __init__(self, foo, bar):
        self.foo = foo
        self.bar = bar
    with_getters_for(MyClass, 'foo', 'bar')
    
    foo = 'foo_var'
    bar = 'bar_var'

    clazz = MyClass(foo, bar)
    self.assertEquals(foo, clazz.get_foo(), "Should have a getter for foo")
    self.assertEquals(bar, clazz.get_bar(), "Should have a getter for bar")

if __name__ == '__main__':
  unittest.main()
