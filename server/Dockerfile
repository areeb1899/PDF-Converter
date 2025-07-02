# Use a slim Node.js 20 base image (compatible with sharp, express@5, etc.)
FROM node:20-slim

# Set the working directory inside the container
WORKDIR /app

# Install necessary system dependencies
RUN apt-get update && apt-get install -y \
  libreoffice \
  poppler-utils \
  qpdf \
  ca-certificates \
  fonts-dejavu \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# Copy only package.json and lock file first for better caching
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the server code into the container
COPY . .

# Expose port your app listens on
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
