FROM ubuntu AS common

# Build with custom Node.js version: docker build --build-arg NODE_VERSION=18.x -t myapp .
# Defaults to Node.js 20.x if not specified
ARG NODE_VERSION=20.x

# Install necessary system dependencies
RUN apt-get update \
    && apt-get install --no-install-recommends -y \
    curl \
    gnupg \
    ca-certificates \
    && mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_${NODE_VERSION} nodistro main" | tee /etc/apt/sources.list.d/nodesource.list \
    && apt-get update \
    && apt-get install --no-install-recommends -y \
    nodejs \
    nginx \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set up working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

FROM common AS dev
# Install development tools
RUN apt-get update \
    && apt-get install --no-install-recommends -y \
    git \
    openssh-client \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set development environment
ENV NODE_ENV=development

FROM common AS prod
# Set production environment
ENV NODE_ENV=production

# Build the application with better error handling
RUN echo "Starting build process..." && \
    npm run build || (echo "Build failed with exit code $?" && exit 1)

# Remove development dependencies
RUN npm prune --production

# Configure nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Set permissions
RUN chown -R www-data:www-data /app

# Expose port 3000 for Next.js and 80 for nginx
EXPOSE 3000 80

# Start the application
CMD ["npm", "start"]
