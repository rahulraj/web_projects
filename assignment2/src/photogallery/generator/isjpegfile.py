import re

def is_jpeg_file(file_name):
  jpeg_file_re = re.compile(r'\.jpg$')
  return jpeg_file_re.search(file_name) != None
