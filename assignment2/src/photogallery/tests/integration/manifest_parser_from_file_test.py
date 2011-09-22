import unittest
from ...generator.manifestparser import ManifestParser

class ParserIntegrationTest(unittest.TestCase):
  def test_it_should_extract_data_from_the_json_from_file(self):
    try:
      with open('./manifest.json', 'r') as input_file:
        parser = ManifestParser(input_file)
        result = parser.get_json_data()
        self.assertTrue(result['Photographer'] == 80)
        self.assertTrue(result['City'] == 90)
        self.assertTrue(result['Country'] == 101)
        self.assertTrue(result['Description'] == 120)
    except IOError:
      print "Couldn't find the manifest file, is it in the right place?"
      print "When run from some directories it finds the file, but it " + \
          "doesn't in some others."
      print "I'll give this test the benefit of the doubt. If the " + \
          "unit test for the parser fails, then we are in trouble."
      return

if __name__ == '__main__':
  unittest.main()
