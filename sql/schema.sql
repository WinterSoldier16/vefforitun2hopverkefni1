CREATE TABLE users (
  id serial primary key,
  name varchar(64) NOT NULL,
  username character varying(255) NOT NULL,
  password character varying(255) NOT NULL,
  admin boolean
);

CREATE TABLE flokkur (
  id serial primary key,
  title VARCHAR(64) NOT NULL UNIQUE
);

CREATE TABLE vorur (
  id serial primary key,
  title VARCHAR(64) NOT NULL UNIQUE,
  price INTEGER NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(64) NOT NULL,
  flokkar INTEGER NOT NULL,
  constraint flokkar FOREIGN KEY (flokkar) REFERENCES flokkur (id),
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE karfa (
  id uuid primary key,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE linurkorfu (
  id serial primary key,
  idkarfa uuid NOT NULL,
  fjoldivara INTEGER CHECK (fjoldivara > 0),
  constraint idkarfa FOREIGN KEY (idkarfa) REFERENCES karfa (id)
);

CREATE TABLE pontun (
  id uuid primary key,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  name VARCHAR(64) NOT NULL
);

CREATE TABLE linurpontun (
  idvara INTEGER NOT NULL,
  idkarfa uuid NOT NULL,
  fjvara INTEGER CHECK (fjvara > 0),
  constraint idvara FOREIGN KEY (idvara) REFERENCES vorur (id),
  constraint idkarfa FOREIGN KEY (idkarfa) REFERENCES karfa (id)
);

CREATE TABLE stadapontun (
  id serial primary key,
  stodurpontunar VARCHAR(8), 
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);