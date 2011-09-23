#!/usr/bin/env/python
import sys
from photogallery.generator import gallerygenerator

if __name__ == '__main__':
  """
  Main function for the whole application.
  """
  generator = gallerygenerator.create_gallery_generator(sys.argv[1:])
  generator.run()
