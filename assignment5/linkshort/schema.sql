drop table if exists users;
drop table if exists pages;
drop table if exists page_visits;
create table users (
  id integer primary key autoincrement,
  username string not null,
  hashed_password string not null,
  salt string not null
);
create table pages (
  id integer primary key autoincrement,
  created_by_user integer not null,
  original_url string not null,
  shortened_url string not null
);
create table page_visits (
  id integer primary key autoincrement,
  for_page integer not null,
  time_visited integer not null
);
