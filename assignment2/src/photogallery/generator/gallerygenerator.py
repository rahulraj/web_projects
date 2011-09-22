from ..utils.inject import assign_injectables

class GalleryGenerator(object):
  def __init__(self, manifest_parser, gallery_item_factory,
      jpeg_directory_exporter):
    assign_injectables(self, locals())

  @classmethod
  def create_gallery_generator(command_line_arguments):
    pass

  def run(self):
    pass
