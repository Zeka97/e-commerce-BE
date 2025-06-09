-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    ime VARCHAR(255),
    prezime VARCHAR(255),
    adresa TEXT,
    telefon VARCHAR(20),
    grad VARCHAR(255),
    potrosen_novac DECIMAL(10,2) DEFAULT 0
);

-- Create admin table
CREATE TABLE admin (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Create kategorije table
CREATE TABLE kategorije (
    id SERIAL PRIMARY KEY,
    naziv VARCHAR(255) NOT NULL
);

-- Create artikli table
CREATE TABLE artikli (
    id SERIAL PRIMARY KEY,
    naziv VARCHAR(255) NOT NULL,
    description TEXT,
    photo VARCHAR(255),
    cijena DECIMAL(10,2) NOT NULL,
    akcijska_cijena DECIMAL(10,2),
    max_kolicina INTEGER NOT NULL,
    broj_prodanih INTEGER DEFAULT 0,
    kategorija_id INTEGER REFERENCES kategorije(id),
    visibility BOOLEAN DEFAULT true
);

-- Create narudzbe table
CREATE TABLE narudzbe (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    datum_narudzbe TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ukupna_cijena DECIMAL(10,2) NOT NULL
);

-- Create artikli_narudzbe table (junction table for orders and articles)
CREATE TABLE artikli_narudzbe (
    id SERIAL PRIMARY KEY,
    narudzba_id INTEGER REFERENCES narudzbe(id),
    naziv VARCHAR(255) NOT NULL,
    cijena DECIMAL(10,2) NOT NULL,
    kolicina INTEGER NOT NULL
); 