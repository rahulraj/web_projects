#!/usr/bin/env/python
import sys
from photogallery.generator.gallerygenerator import GalleryGenerator

if __name__ == '__main__':
  """
  Main function for the whole application.
  """
  generator = GalleryGenerator.create_gallery_generator(sys.argv[1:])
  generator.run()
  pass
