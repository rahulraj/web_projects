class DisallowedModification(Exception):
  pass

class ImmutableDict(dict):
  def __setitem__(self, new_key, new_value):
    raise DisallowedModification
