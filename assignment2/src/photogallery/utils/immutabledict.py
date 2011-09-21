class DisallowedModification(Exception):
  """ Exception to throw when code tries to mutate an immutable object. """
  pass

class ImmutableDict(dict):
  """
  A dict that raises DisallowedModification if one tries to change
  its values.
  """
  def __setitem__(self, new_key, new_value):
    raise DisallowedModification
