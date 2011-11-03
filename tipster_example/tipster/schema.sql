-- all dates in Unix epoch seconds
create table if not exists subjects (
    id integer primary key,
    created integer, -- date
    by integer references users(id),
    name text,
    category integer,
    category_name text
);
    
create table if not exists categories (
    id integer primary key,
    name text
);

create table if not exists users (
    id integer primary key,
    first text,
    last text,
    email text,
    password text
);

create table if not exists reviews (
    id integer primary key,
    created integer, -- date
    by integer references users(id),
    content text,
    rating integer,
    about integer references subjects(id)
--    , unique (about, by)
);
