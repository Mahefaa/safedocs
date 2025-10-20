# Use Node 22.12.0 Alpine image
FROM node:22.12.0-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Expose Vite default port
EXPOSE 5173

# Start Vite dev server accessible on 0.0.0.0
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
