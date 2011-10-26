import random

def random_string(length=5):
  """
  Creates a random string from alphanumeric characters. While it's unlikely
  that duplicates will be created, client code should still test this.

  This code was derived from information provided at:
  http://stackoverflow.com/questions/2511222/efficiently-generate-a-16-character-alphanumeric-string

  Args:
    length the length of the random string to create.
  """
  possibles = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
  return ''.join(random.choice(possibles) for i in range(0, length))
