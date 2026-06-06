#Base Builder Image
FROM rust:1.88-slim AS base

ENV DEBIAN_FRONTEND=noninteractive

# Install Node.js LTS
RUN apt-get update && apt-get install -y \
    curl \
    git \
    wget \
    pkg-config \
    build-essential \
    libssl-dev \
    libgtk-3-dev \
    libwebkit2gtk-4.1-dev \
    libappindicator3-dev  \
    librsvg2-dev \
    patchelf \
    openssl \
    ca-certificates \
    xdg-utils \
    file \
    libxdo-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get update && apt-get install -y nodejs

# Install package managers
RUN npm install -g \
    pnpm \
    yarn \
    @tauri-apps/cli

# Create non-root user
RUN useradd -ms /bin/bash developer

WORKDIR /app


# Dependency Cache Stage
FROM base AS dependencies

COPY package.json ./
COPY package-lock.json* ./
COPY pnpm-lock.yaml* ./
COPY yarn.lock* ./

RUN \
    if [  -f package-lock.json ]; then npm install; fi && \
    if [  -f pnpm-lock.yaml ]; then pnpm install; fi && \
    if [  -f yarn.lock ]; then yarn install; fi

COPY src-tauri/Cargo.toml ./src-tauri/Cargo.toml
COPY src-tauri/Cargo.lock ./src-tauri/Cargo.lock

RUN mkdir -p src-tauri/src && \
    echo "fn main() {}" > src-tauri/src/main.rs && \
    touch src-tauri/src/lib.rs

RUN cd src-tauri && cargo fetch

# Development Stage
FROM base AS development

COPY --from=dependencies /usr/local/cargo  /usr/local/cargo
COPY --from=dependencies /app /app

WORKDIR /app

#USER developer

USER root
RUN mkdir -p /tmp/cargo-target && chmod -R 777 /tmp/cargo-target

EXPOSE 1420
EXPOSE 1421
EXPOSE 5173

CMD ["npm", "run", "tauri", "dev"]