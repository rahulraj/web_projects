import random
import functools

def create_url_shortener(database_service, length=5):
  """
  Create a URL shortener function that makes use of the given database

  Args:
    database_service the service to use.
    length the length of the URLs.
  """
  def has_url(short_url):
    return database_service.find_page_by_shortened_url(short_url) is not None
  return functools.partial(unique_shortened_url_string,
      has_url, random_string, length)

def unique_shortened_url_string(has_url, generate_url, length=5):
  """
  Get a unique shortened URL string.

  Args:
    has_url a function that takes a string and returns True if that
        string already exists (and can't be used).
    generate_url a function to generate a URL. Presumably, not referentially
        transparent.
    length the length of the string.
  """
  shortened = generate_url(length)
  while has_url(shortened):
    # Try again until we get a unique one.
    shortened = generate_url(length)
  return shortened

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
