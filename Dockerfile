# Use the official Node.js image as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock) into the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code into the working directory
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 5001

# Define the command to run the application
CMD ["npm", "start"]
