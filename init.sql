-- init.sql
UPDATE mysql.user SET host='%' WHERE user='root';
FLUSH PRIVILEGES;

CREATE DATABASE IF NOT EXISTS MAAS;