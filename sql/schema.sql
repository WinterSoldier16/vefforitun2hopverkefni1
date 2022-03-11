CREATE TABLE users (
  id serial primary key,
  username character varying(255) NOT NULL,
  password character varying(255) NOT NULL,
  admin boolean
);