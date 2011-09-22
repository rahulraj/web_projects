import unittest
from ..generator.manifestparser import parse_manifest_data

class ManifestParserTest(unittest.TestCase):
  def test_it_should_extract_data_from_the_json_object(self):
    to_parse = '{"Photographer": 80,\n' + \
               '"City": 90,\n' + \
               '"Country": 101,\n' + \
               '"Description": 120 }'
    result = parse_manifest_data(to_parse)
    self.assertTrue(result['Photographer'] == 80)
    self.assertTrue(result['City'] == 90)
    self.assertTrue(result['Country'] == 101)
    self.assertTrue(result['Description'] == 120)

if __name__ == '__main__':
  unittest.main()
