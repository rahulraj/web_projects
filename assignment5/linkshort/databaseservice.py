import sqlite3
from contextlib import closing
from inject import assign_injectables
from getters import with_getters_for

def connect_database(database_file):
  """
  Connect to a database

  Args:
    database_file the file containing the sqlite3 data.
  """
  return sqlite3.connect(database_file)

def initialize_database(database_file, schema):
  """
  Initialize a database

  Args:
    database_file the file to put the database
    schema the file containing the database schema
  """
  with closing(connect_database(database_file)) as database:
    database.cursor().executescript(schema.read())
    database.commit()

class NoSuchUser(Exception):
  """ The user requested does not exist. """
  pass

class DatabaseService(object):
  """
  Class to execute the queries that the application needs, using
  parameterized statements.
  This class only contains the queries; client code is responsible
  for opening and closing the database connection.
  """
  def __init__(self, connection, database):
    """
    Constructor for DatabaseService

    Args:
      connection the connection to use.
      database the database cursor to use.
    """
    assign_injectables(self, locals())

  def add_user(self, user):
    """
    Ignores the ID attribute of user, allowing the database to create
    a new autoincrement ID. Use the returned User to make calls to find_*

    Args:
      user a User object containing the row data (except for the ID)

    Returns:
      A new User object with the ID field filled in.
    """
    # Pass in null for the ID; sqlite will automatically generate an ID.
    self.database.execute( \
        'insert into users values (null, :username, :hashed_password, :salt)',
        {'username': user.get_username(), 
         'hashed_password': user.get_hashed_password(),
         'salt': user.get_salt()})
    self.connection.commit()
    return User(user.get_username(), user.get_hashed_password(),
        user.get_salt(), id=self.database.lastrowid)

  def add_page(self, page):
    """
    Adds a page, creating an autoincrement ID

    Args:
      page a Page object with the row data (except the ID)

    Returns:
      A new Page object with ID populated.
    """
    self.database.execute( \
        """
        insert into pages 
        values (null, :created_by_user, :original_url, :shortened_url)
        """,
        {'created_by_user': page.get_created_by_user(),
         'original_url': page.get_original_url(),
         'shortened_url': page.get_shortened_url()})
    self.connection.commit()
    return Page(page.get_created_by_user(), page.get_original_url(),
        page.get_shortened_url(), id=self.database.lastrowid)

  def add_page_for_user(self, user, original_url, shortened_url):
    """
    Add a page that a user entered and shortened.

    Args:
      user the user who created the page.
      original_url the original URL.
      shortened_url the shortened URL.

    Returns:
      The Page object created.
    """
    created_by = user.get_id()
    page = Page(created_by, original_url, shortened_url)
    return self.add_page(page)

  def add_page_visit(self, visit):
    """
    Adds a PageVisit, with an autoincrement ID
    
    Args:
      visit a PageVisit object with the row data

    Returns:
      A new PageVisit with ID populated.
    """
    self.database.execute( \
        'insert into page_visits values (null, :for_page, :time_visited)',
        {'for_page': visit.get_for_page(),
         'time_visited': visit.get_time_visited()})
    self.connection.commit()
    return PageVisit(visit.get_for_page(), visit.get_time_visited(),
        self.database.lastrowid)

  def add_visit_for_page(self, page, time_visited):
    """
    Note a visit for a shortened page

    Args:
      page the page that was visited.
      time_visited the time when it was visited

    Returns:
      The created PageVisit.
    """
    for_page = page.get_id()
    visit = PageVisit(for_page=for_page, time_visited=time_visited)
    return self.add_page_visit(visit)

  def user_query(self, username):
    """
    Helper method to query for a user

    Args:
      username the name of the user

    Returns:
      The row with that username.
    """
    self.database.execute( \
        'select * from users where username=:username',
        {'username': username})
    return self.database.fetchone()

  def has_user_with_name(self, username):
    """
    Tell if a user exists

    Args:
     username the user name to check.

    Returns:
      True if that username is in the database.
    """
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
    """
    Finds the pages submitted by user

    Args:
      user the user by which to make lookups.

    Returns:
      A generator, containing the Pages that user shortened.
    """
    self.database.execute( \
        """
        select id, created_by_user, original_url, shortened_url
            from pages
            where created_by_user = :user_id
            order by id
        """, {'user_id': user.get_id()})
    return (Page(page_row[1], page_row[2], page_row[3], id=page_row[0]) for \
        page_row in self.database)

  def find_page_by_shortened_url(self, shortened_url):
    """
    Finds the page whose shortened_url is the one given

    Args:
      shortened_url the URL to look up

    Returns:
      The Page with that URL, or None if it doesn't exist.
    """
    self.database.execute( \
        """ 
        select id, created_by_user, original_url, shortened_url
        from pages
        where shortened_url = :shortened_url
        """, {'shortened_url': shortened_url})
    row = self.database.fetchone()
    if row is None:
      return None
    return Page(row[1], row[2], row[3], id=row[0])

  def find_visits_of_page(self, page):
    """
    Finds the visit data for a page

    Args:
      page the page to lookup

    Returns:
      A generator containing the PageVisits logged for page.
    """
    self.database.execute( \
        """ 
        select id, for_page, time_visited
        from page_visits
        where for_page = :page_id
        order by id
        """, {'page_id': page.get_id()})
    return (PageVisit(visit_row[1], visit_row[2], id=visit_row[0]) for \
        visit_row in self.database)

  def close(self):
    self.database.close()

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

class PageVisit(object):
  def __init__(self, for_page, time_visited, id=None):
    assign_injectables(self, locals())
with_getters_for(PageVisit, 'id', 'for_page', 'time_visited')
