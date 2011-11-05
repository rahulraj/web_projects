drop table if exists users;
drop table if exists players;
drop table if exists rooms;
drop table if exists exits;
drop table if exists items;
drop table if exists item_unlocking_items;
drop table if exists exit_unlocking_items;
create table users (
  id integer primary key autoincrement,
  username string not null,
  hashed_password string not null,
  salt string not null
);
create table players (
  id integer primary key autoincrement,
  created_by_user integer not null,
  currently_in_room integer not null
);
create table rooms (
  id integer primary key autoincrement,
  name string not null,
  description string not null,
  final_room boolean not null
);
create table exits (
  id integer primary key autoincrement,
  name string not null,
  description string not null,
  from_room integer not null,
  to_room integer not null,
  locked boolean not null
);
create table items (
  id integer primary key autoincrement,
  name string not null,
  description string not null,
  use_message string not null,
  owned_by_player integer, -- Can be null if not yet picked up
  in_room integer, -- Can be null if picked up
  locked boolean not null
);
create table item_unlocking_items (
  item_id integer not null, -- Points to the corresponding entry in items
  unlocks_item integer not null
);
create table exit_unlocking_items (
  item_id integer not null, -- Points to the corresponding entry in items
  unlocks_exit integer not null
);
