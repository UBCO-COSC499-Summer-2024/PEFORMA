FROM postgres:latest

# Copy the SQL scripts from the backend/ddl directory relative to the 'app' context
COPY ./ddl/ddl.sql /docker-entrypoint-initdb.d/10-init.sql
COPY ./ddl/dml.sql /docker-entrypoint-initdb.d/20-seed.sql
