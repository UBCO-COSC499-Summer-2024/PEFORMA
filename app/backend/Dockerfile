# Use the official Node.js image as a base image
FROM node:14.17.0

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy profile images
COPY ./profile_images ./profile_images

# Install PostgreSQL client
RUN apt-get update && apt-get install -y postgresql-client

# Copy the entrypoint script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Expose the port the app runs on
EXPOSE 5000

# Set the entrypoint
ENTRYPOINT ["/app/entrypoint.sh"]

# Start the application
CMD ["npm", "start"]