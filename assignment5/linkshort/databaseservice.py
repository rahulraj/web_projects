import sqlite3
from contextlib import closing
from inject import assign_injectables
from getters import with_getters_for

def connect_database(database_file):
  return sqlite3.connect(database_file)

def initialize_database(database_file, schema):
  with closing(connect_database(database_file)) as database:
    database.cursor().executescript(schema.read())
    database.commit()

class NoSuchUser(Exception):
  pass

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

  def add_user(self, user):
    """
    Ignores the ID attribute of user, allowing the database to create
    a new autoincrement ID.
    """
    self.database.execute( \
        'insert into users values (NULL, :username, :hashed_password, :salt)',
        {'username': user.get_username(), 
         'hashed_password': user.get_hashed_password(),
         'salt': user.get_salt()})
    return User(user.get_username(), user.get_hashed_password(),
        user.get_salt(), id=self.database.lastrowid)

  def add_page(self, page):
    self.database.execute( \
        'insert into pages values (NULL, :created_by_user, :original_url, :shortened_url)',
        {'created_by_user': page.get_created_by_user(),
         'original_url': page.get_original_url(),
         'shortened_url': page.get_shortened_url()})
    return Page(page.get_created_by_user(), page.get_original_url(),
        page.get_shortened_url(), id=self.database.lastrowid)

  def add_page_for_user(self, user, original_url, shortened_url):
    created_by = user.get_id()
    page = Page(created_by, original_url, shortened_url)
    return self.add_page(page)

  def add_page_view(self, view):
    self.database.execute( \
        'insert into page_visits (NULL, :for_page, :time_visited)',
        {'for_page': view.get_for_page(),
         'time_visited': view.get_time_visited()})
    return PageView(view.get_for_page(), view.get_time_visited(),
        self.database.lastrowid)

  def add_view_for_page(self, page, time_visited):
    for_page = page.get_id()
    view = PageView(for_page, time_visited)
    return self.add_page_view(view)

  def user_query(self, username):
    self.database.execute( \
        'select * from users where username=:username',
        {'username': username})
    return self.database.fetchone()

  def has_user_with_name(self, username):
    row = self.user_query(username) 
    return row is not None

  def find_user_by_name(self, username):
    """
    Finds the user with username

    Args:
      username the name for the user.

    Returns:
      The User for that username.

    Raises:
      NoSuchUser if the user does not exist.
    """
    row = self.user_query(username)
    if row is None:
      raise NoSuchUser
    return User(row[1], row[2], row[3], id=row[0])

  def find_pages_by_user(self, user):
    self.database.execute( \
        """
        select id, created_by_user, original_url, shortened_url
            from pages
            where pages.created_by_user = :user_id
            order by pages.id
        """, {'user_id': user.get_id()}
        )
    return (Page(page_row[1], page_row[2], page_row[3], id=page_row[0]) for \
        page_row in self.database)

  #def find_views_of_page(self, page):

""" 
Immutable data objects representing rows in the databases.
They differ from ORMs in that they do not contain pointers
for relational fields, they are just thin wrappers around the
values in the table.
"""
class User(object):
  def __init__(self, username, hashed_password, salt, id=None):
    assign_injectables(self, locals())
with_getters_for(User, 'id', 'username', 'hashed_password', 'salt')

class Page(object):
  def __init__(self, created_by_user, original_url, shortened_url, id=None):
    assign_injectables(self, locals())
with_getters_for(Page, 'id', 'created_by_user', 'original_url', 'shortened_url')

class PageView(object):
  def __init__(self, for_page, time_visited, id=None):
    assign_injectables(self, locals())
with_getters_for(PageView, 'id' 'for_page', 'time_visited')
