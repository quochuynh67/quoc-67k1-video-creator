FROM node:20-slim

# Install Chromium/Puppeteer system dependencies and ffmpeg
RUN apt-get update && apt-get install -y --no-install-recommends \
    # GLib / GObject (libgobject-2.0)
    libglib2.0-0 \
    # GTK / display stack
    libgtk-3-0 \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libcairo2 \
    # Video encoding (libx264) and media processing
    ffmpeg \
    # Fonts for headless rendering
    fonts-liberation \
    # Chromium browser (avoids runtime download by Puppeteer)
    chromium \
    # Misc utilities
    ca-certificates \
    wget \
    && rm -rf /var/lib/apt/lists/*

ENV CHROMIUM_PATH=/usr/bin/chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app

# Copy root package files for workspace-aware install
COPY package.json package-lock.json* ./

# Copy workspace package files (needed before npm ci)
COPY client/package.json ./client/
COPY server/package.json ./server/

# Copy server scripts needed by postinstall (patch-wvc.mjs runs during npm ci)
COPY server/scripts/ ./server/scripts/

# Install all workspace dependencies
RUN npm ci

# Copy the rest of the project
COPY . .

# Build the server workspace
RUN npm run build --workspace=wvc-editor-server

EXPOSE 3001

CMD ["npm", "run", "start", "--workspace=wvc-editor-server"]
