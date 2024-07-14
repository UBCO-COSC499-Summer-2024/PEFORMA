FROM postgres:latest

COPY ./ddl/ddl.sql /docker-entrypoint-initdb.d/10-init.sql
# COPY ./ddl/dml.sql /docker-entrypoint-initdb.d/20-seed.sql
