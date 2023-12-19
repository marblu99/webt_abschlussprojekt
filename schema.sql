-- Active: 1702931761421@@127.0.0.1@3306@test
create DATABASE test;

use test;

CREATE TABLE notenDatenbank (
    Benutzer VARCHAR(20),
    Fach VARCHAR(20),
    Note DECIMAL(3, 2)
);