FROM postgres:latest

COPY ./sql/ddl.sql /docker-entrypoint-initdb.d/10-init.sql
COPY ./sql/dml.sql /docker-entrypoint-initdb.d/20-seed.sql
