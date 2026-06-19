#Base Builder Image
FROM rust:1.88-slim AS base

ENV DEBIAN_FRONTEND=noninteractive \
    CARGO_HOME=/usr/local/cargo \
    PNPM_HOME=/usr/local/share/pnpm \
    PATH=/usr/local/share/pnpm:/usr/local/cargo/bin:$PATH
    
# Install Node.js LTS
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl git wget pkg-config build-essential libssl-dev \
    libgtk-3-dev libwebkit2gtk-4.1-dev libappindicator3-dev  \
    librsvg2-dev patchelf openssl ca-certificates xdg-utils \
    file libxdo-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get update && apt-get install -y --no-install-recommends nodejs && \
    rm -rf /var/lib/apt/lists/*

# Install package managers
RUN npm install -g \
    pnpm \
    yarn 

# Create non-root user
RUN useradd -ms /bin/bash developer && \
    mkdir -p /app "$PNPM_HOME" && \
    chown -R developer:developer /app "$CARGO_HOME" "$PNPM_HOME"

WORKDIR /app


# Dependency Cache Stage
FROM base AS dependencies

COPY --chown=developer:devloper \ 
    package.json \
    package-lock.json* \
    pnpm-lock.yaml* \
    yarn.lock* \
    ./

RUN \
    if [  -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; \
    elif [  -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [  -f package-lock.json ]; then npm ci; \
    else echo "No lockfile found" && exit 1; fi
    
COPY --chown=developer:developer src-tauri/Cargo.toml  src-tauri/Cargo.lock ./src-tauri/
RUN mkdir -p /app/src-tauri/src && touch /app/src-tauri/src/lib.rs
RUN cd src-tauri && cargo fetch

# Development Stage
FROM base AS development

COPY --from=dependencies --chown=developer:developer /usr/local/cargo  /usr/local/cargo
COPY --from=dependencies --chown=developer:developer /usr/local/share/pnpm  /usr/local/share/pnpm
COPY --from=dependencies --chown=developer:developer /app /app

#USER developer

USER root
RUN mkdir -p /app/src-tauri/target && \
    chown -R developer:developer /app/src-tauri/target && \
    chmod -R 777 /app/src-tauri/target

USER developer

EXPOSE 1420
EXPOSE 1421
EXPOSE 5173

CMD ["pnpm", "tauri", "dev"]

FROM dependencies AS builder

COPY --chown=developer:developer . .

RUN if [ -f pnpm-lock.yaml ]; then pnpm tauri build; \
    elif [ -f yarn.lock ]; then yarn tauri build; \
    else npm run tauri build; fi