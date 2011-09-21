"""
Module providing a utility function to generate getter methods
for a class. 

Example usage:
  
class MyClass(object):
  def __init__(self, foo, bar):
    self.foo = foo
    self.bar = bar
with_getters_for(MyClass, 'foo', 'bar')

And all objects of type MyClass will respond to get_foo and get_bar methods.
"""

def create_getter(var_name):
  """ Given the string name of a variable, creates a getter function for that
      variable and returns it.

      Args:
        var_name the name of the variable for which a getter should be created.
  """ 
  def getter(self):
    """ The getter function to be returned."""
    return getattr(self, var_name)
  return getter

def with_getters_for(clazz, *args):
  """ Given a class and an arbitrary number of strings representing variable
      names, adds getter functions for those variables to the class.
      
      Args:
        clazz the class to which getters should be added.
        *args the names of variables that need getters.
  """
  getters = map(create_getter, args)
  for arg, getter in zip(args, getters):
    setattr(clazz, 'get_' + arg, getter)
