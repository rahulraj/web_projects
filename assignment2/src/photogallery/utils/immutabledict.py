from disallowedmodification import DisallowedModification

class ImmutableDict(dict):
  """
  A dict that raises DisallowedModification if one tries to change
  its values. Mutator methods are overriden.
  """

  @classmethod
  def of(clazz, **kwargs):
    """
    Syntatic sugar to create an immutable dict with string keys using kwargs.

    Args:
      **kwargs the keywords and values to include in the dict
    """
    return clazz(kwargs)

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
