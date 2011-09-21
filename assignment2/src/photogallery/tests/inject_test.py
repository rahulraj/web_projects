import unittest
from ..utils.inject import assign_injectables

class TestAssignInjectables(unittest.TestCase):
  def test_it_should_assign_variables_that_are_injected_into_the_object(self):
    class WithInjectableConstructor(object):
      def __init__(self, foo, bar):
        assign_injectables(self, locals())

    foo = 'foo'
    bar = 'bar'

    under_test = WithInjectableConstructor(foo, bar)

    self.assertEquals(foo, under_test.foo, 'foo should be injected')
    self.assertEquals(bar, under_test.bar, 'bar should also be injected')
    self.assertFalse(hasattr(under_test, 'self'), 'self should not be injected')

if __name__ == '__main__':
  unittest.main()
