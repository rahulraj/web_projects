from ..utils.inject import assign_injectables

class GalleryGenerator(object):
  def __init__(self, gallery_item_factory, path, exporter):
    """
    Constructor for GalleryGenerator

    Args:
      gallery_item_factory the GalleryItemFactory that creates the items.
      path the path of the directory to start in.
      exporter the Exporter to populate the templates.
    """
    assign_injectables(self, locals())

  @classmethod
  def create_gallery_generator(command_line_arguments):
    pass

  def run(self):
    top_directory = self.gallery_item_factory.create_directory(self.path)
    directory_view = top_directory.as_directory_view()
    populated_template = self.exporter.export(directory_view)
