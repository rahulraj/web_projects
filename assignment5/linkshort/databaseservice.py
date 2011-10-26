from inject import assign_injectables

class DatabaseService(object):
  """
  Class to execute the queries that the application needs, using
  parameterized statements.
  This class only contains the queries; client code is responsible
  for opening and closing the database connection.
  """
  def __init__(self, database):
    """
    Constructor for DatabaseService

    Args:
      database the database connection to use.
    """
    assign_injectables(self, locals())

  def create_user(self, username, hashed_password, salt):
    with self.database:
      self.database.execute( \
          'insert into users values (:username, :hashed_password, :salt)',
          {'username': username, 'hashed_password': hashed_password,
           'salt': salt})

  def create_page(self, created_by_user, original_url, shortened_url):
    with self.database:
      self.database.execute( \
          'insert into pages values (:created_by_user, :original_url, :shortened_url)',
          {'created_by_user': created_by_user, 'original_url': original_url,
           'shortened_url': shortened_url})

  def create_page_view(self, for_page, time_visited):
    with self.database:
      self.database.execute( \
          'insert into page_visits (:for_page, :time_visited)',
          {'for_page': for_page, 'time_visited': time_visited})

  def find_user_by_name(self, username):
    pass

class UserData(object):
  def __init__(self, username, hashed_password, salt):
    assign_injectables(self, locals())
