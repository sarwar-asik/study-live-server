# Use the official Node.js image.
# https://hub.docker.com/_/node
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json (or yarn.lock) files
COPY package*.json ./
# Alternatively, if using yarn:
# COPY yarn.lock ./

# Install dependencies
RUN npm install
# Or if using yarn:
# RUN yarn install

# Copy the rest of your application code
COPY . .

# Build the TypeScript code
RUN npm run build
# Or if using yarn:
# RUN yarn build

# Expose the port the app runs on
EXPOSE 5001

# Command to run the application
CMD ["npm", "start"]
# Or if using yarn:
# CMD ["yarn", "start"]
