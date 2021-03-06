CREATE TABLE users (
  id serial primary key,
  email varchar(64) NOT NULL,
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
  image VARCHAR(128),
  flokkar VARCHAR(32) NOT NULL,
  constraint flokkar FOREIGN KEY (flokkar) REFERENCES flokkur (title) ON UPDATE CASCADE ON DELETE CASCADE,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE karfa (
  id uuid primary key,
  price INTEGER,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE linurkorfu (
  idvara INTEGER NOT NULL,
  idkarfa uuid NOT NULL,
  fjoldivara INTEGER CHECK (fjoldivara > 0),
  constraint idkarfa FOREIGN KEY (idkarfa) REFERENCES karfa (id) ON DELETE CASCADE,
  constraint idvara FOREIGN KEY (idvara) REFERENCES vorur (id) ON DELETE CASCADE
);

CREATE TABLE pontun (
  id uuid primary key,
  price INTEGER NOT NULL,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  name VARCHAR(64) NOT NULL
);

CREATE TABLE linurpontun (
  idvara INTEGER NOT NULL,
  idpontun uuid NOT NULL,
  fjvara INTEGER CHECK (fjvara > 0),
  constraint idvara FOREIGN KEY (idvara) REFERENCES vorur (id) ON DELETE CASCADE,
  constraint idpontun FOREIGN KEY (idpontun) REFERENCES pontun (id) ON DELETE CASCADE
);

CREATE TABLE stadapontun (
  idpontun uuid NOT NULL,
  stodurpontunar VARCHAR(8),
  constraint idpontun FOREIGN KEY (idpontun) REFERENCES pontun (id) ON DELETE CASCADE, 
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);