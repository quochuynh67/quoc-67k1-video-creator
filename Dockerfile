FROM node:20-slim

# Chrome system deps + ffmpeg
RUN apt-get update && apt-get install -y --no-install-recommends \
    libglib2.0-0 libgtk-3-0 libnss3 libatk1.0-0 libatk-bridge2.0-0 \
    libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 \
    libxrandr2 libgbm1 libasound2 libpango-1.0-0 libpangocairo-1.0-0 libcairo2 \
    ffmpeg fonts-liberation ca-certificates wget \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app/server

# scripts/ must come before npm install so the postinstall patch-wvc.mjs can run
COPY server/scripts/ ./scripts/

# Install deps (postinstall patches web-video-creator logger to fix util.isString crash)
COPY server/package.json server/package-lock.json* ./
RUN npm install

# Copy source and build
COPY server/tsconfig.json ./
COPY server/src/ ./src/
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]
