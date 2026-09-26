# PharmaNest backend Dockerfile
FROM node:20-bookworm-slim

WORKDIR /app

# bcrypt needs to compile a native addon, so we need build tools + python
# Installed in a separate layer so they're cached unless package.json changes
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy only manifest files first -> Docker caches npm install unless these change
COPY package*.json ./

# --legacy-peer-deps matches what render.yaml currently uses for this repo
RUN npm install --legacy-peer-deps --omit=dev

# Now copy the rest of the source
COPY . .

# Run as non-root for basic container hardening
RUN groupadd -r appuser && useradd -r -g appuser appuser \
    && chown -R appuser:appuser /app
USER appuser

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 --start-period=10s \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 5000) + '/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "app.js"]