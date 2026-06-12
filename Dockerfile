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
    # Misc utilities
    ca-certificates \
    wget \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app/server

# Copy package files first for better layer caching
COPY package.json package-lock.json* ./

# Install dependencies (postinstall script patches web-video-creator)
RUN npm install

# Copy source and config
COPY tsconfig.json ./
COPY src/ ./src/
COPY scripts/ ./scripts/

# Build TypeScript
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]
