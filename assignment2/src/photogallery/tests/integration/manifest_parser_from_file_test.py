import unittest
from ...generator.manifestparser import ManifestParser

class ParserIntegrationTest(unittest.TestCase):
  def test_it_should_extract_data_from_the_json_from_file(self):
    with open('manifest.json') as input_file:
      parser = ManifestParser(input_file)
      result = parser.get_json_data()
      self.assertTrue(result['Photographer'] == 80)
      self.assertTrue(result['City'] == 90)
      self.assertTrue(result['Country'] == 101)
      self.assertTrue(result['Description'] == 120)

if __name__ == '__main__':
  unittest.main()
