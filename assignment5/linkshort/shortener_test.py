import shortener
import unittest

class ShortenerTest(unittest.TestCase):
  def setUp(self):
    counter = {'count': 0}
    urls = ['short_url1', 'short_url2']
    def fake_generate_url(_):
      result = urls[counter['count']]
      counter['count'] += 1
      return result
    self.fake_generate_url = fake_generate_url

  def test_simple_url_generation(self):
    def fake_has_url(_):
      return False
    url = shortener.unique_shortened_url_string(fake_has_url,
        self.fake_generate_url)
    self.assertEquals('short_url1', url)

  def test_url_when_first_fails(self):
    def fake_has_url(url):
      return url == 'short_url1'
    url = shortener.unique_shortened_url_string(fake_has_url,
        self.fake_generate_url)
    self.assertEquals('short_url2', url)

class CreateShortenerTest(unittest.TestCase):
  def setUp(self):
    class FakeDatabaseService(object):
      def find_page_by_shortened_url(self, shortened_url):
        return None
    self.shorten = shortener.create_url_shortener(FakeDatabaseService(),
        length=5)

  def test_generate_short_url(self):
    url = self.shorten()
    self.assertEquals(5, len(url))
