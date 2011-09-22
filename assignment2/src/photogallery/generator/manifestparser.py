import simplejson as json
from ..utils.inject import assign_injectables

def parse_manifest_data(to_parse):
  return json.loads(to_parse)

class ManifestParser(object):
  def __init__(self, input_file):
    assign_injectables(self, locals())

  def get_json_data(self):
    lines = self.input_file.readlines()
    json_string = "\n".join(lines)
    return parse_manifest_data(json_string)
