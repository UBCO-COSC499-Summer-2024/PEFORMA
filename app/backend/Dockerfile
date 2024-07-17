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

# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD ["npm", "start"]