""" 
Module providing a utility function assign_injectables to be used when
initializing a class and injecting its dependencies.
"""

def is_magic_variable(var_name):
  """
  Determines if a variable's name indicates that it is a 'magic variable'.
  That is, it starts and ends with two underscores. e.g. '__foo__'. These
  variables should not be injected. 

  Args:
    var_name the name of the variable.

  Returns:
    True if var_name starts and ends with two underscores, False
    otherwise.
  """
  return var_name[0] == '_' and var_name[1] == '_' and \
     var_name[len(var_name) - 1] == '_'and \
     var_name[len(var_name) - 2] == '_'

def assign_injectables(obj, locals_dict):
  """
  Given an object and a dictionary containing local variables in the
  object's constructor, finds the injectable variables (not magic
  variables or self), and sets those attributes on the object.

  Args:
    obj the object on which to set attributes.
    locals_dict the dictionary containing local variables at
                construction time.
  """

  def is_injectable(var_name):
    """
    Determines if a variable should be injected

    Args:
      var_name the name of the variable

    Returns:
      True if the variable should be injected, False otherwise
    """
    if is_magic_variable(var_name):
      return False
    elif locals_dict[var_name] == obj:
      return False
    return True

  keys = locals_dict.keys()
  injectables = filter(is_injectable, keys)
  for injectable in injectables:
    setattr(obj, injectable, locals_dict[injectable])
