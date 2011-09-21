class DisallowedModification(Exception):
  """ Exception to throw when code tries to mutate an immutable object. """
  pass

class ImmutableDict(dict):
  """
  A dict that raises DisallowedModification if one tries to change
  its values. Mutator methods are overriden.
  """
  def __setitem__(self, new_key, new_value):
    raise DisallowedModification

  def pop(self, key, default=None):
    raise DisallowedModification

  def popitem(self):
    raise DisallowedModification

  def setdefault(self, key, default=None):
    raise DisallowedModification

  def update(*args, **kwargs):
    raise DisallowedModification
