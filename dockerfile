# Use Alpine-based Node.js image for amd64
FROM --platform=linux/amd64 node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies (with faster install using npm ci if package-lock.json exists)
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Expose the necessary port (if needed, not in this case)
# EXPOSE 8080

# Run the Node.js app
CMD [ "node", "redis-cluster-test.js" ]
