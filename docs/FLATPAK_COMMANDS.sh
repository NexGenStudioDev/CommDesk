#!/usr/bin/env bash
# CommDesk Flatpak Quick Reference & Commands

# ============================================================================
# SETUP & INSTALLATION
# ============================================================================

# 1. Install flatpak tools (run once)
# Ubuntu/Debian:
sudo apt install flatpak flatpak-builder gnome-software-plugin-flatpak

# Fedora:
sudo dnf install flatpak flatpak-builder

# Arch:
sudo pacman -S flatpak flatpak-builder

# 2. Add Flathub repository (run once)
flatpak remote-add --if-not-exists --user flathub https://dl.flathub.org/repo/flathub.flatpakrepo


# ============================================================================
# BUILD & INSTALL
# ============================================================================

# Clean build (removes old artifacts)
flatpak-builder --force-clean --user --install-deps-from=flathub --repo=repo builddir org.commdesk.CommDesk.json

# Incremental build (keeps cached artifacts)
flatpak-builder --user --install-deps-from=flathub --repo=repo builddir org.commdesk.CommDesk.json

# Install after building
flatpak install --user --from-file=repo/appstream/org.commdesk.CommDesk.flatpakref

# One-liner: build and install
flatpak-builder --force-clean --user --install-deps-from=flathub --repo=repo builddir org.commdesk.CommDesk.json && \
  flatpak install --user --from-file=repo/appstream/org.commdesk.CommDesk.flatpakref


# ============================================================================
# RUNNING & TESTING
# ============================================================================

# Run the app
flatpak run org.commdesk.CommDesk

# Run with verbose logging
G_MESSAGES_DEBUG=all flatpak run org.commdesk.CommDesk

# Run with a bash shell (for debugging)
flatpak run --command=bash org.commdesk.CommDesk

# Test without document access
flatpak run --no-documents org.commdesk.CommDesk

# Run shell as app user
flatpak run --command=sh org.commdesk.CommDesk


# ============================================================================
# DEBUGGING & INFO
# ============================================================================

# View installed version
flatpak info org.commdesk.CommDesk

# Check permissions
flatpak info --show-permissions org.commdesk.CommDesk

# List all installed flatpaks
flatpak list --app

# View app data location
flatpak info --mode=user --show-location org.commdesk.CommDesk


# ============================================================================
# PACKAGE CREATION & DISTRIBUTION
# ============================================================================

# Create single-file bundle for distribution
flatpak build-bundle repo commdesk.flatpak org.commdesk.CommDesk \
  --runtime-repo=https://flathub.org/repo/flathub.flatpakrepo

# Users can install the bundle with:
# flatpak install --user commdesk.flatpak


# ============================================================================
# MAINTENANCE & UPDATES
# ============================================================================

# Update flatpak runtime
flatpak update

# Remove the app
flatpak remove org.commdesk.CommDesk

# Uninstall and remove data
flatpak remove --delete-data org.commdesk.CommDesk

# Clean up unused runtimes
flatpak remove --unused


# ============================================================================
# BUILD ENVIRONMENT
# ============================================================================

# Enter the build sandbox to debug
flatpak run --command=bash --develop-mode builddir

# View build logs (while building)
tail -f /tmp/flatpak-builder-*.log


# ============================================================================
# KEY FILES
# ============================================================================

# Manifest (main configuration)
# org.commdesk.CommDesk.json

# Desktop entry (app integration)
# org.commdesk.CommDesk.desktop

# Build documentation
# docs/FLATPAK_BUILD_GUIDE.md
# docs/FLATPAK_SETUP_SUMMARY.md

# Application icon
# public/logo.png


# ============================================================================
# USEFUL ENVIRONMENT VARIABLES
# ============================================================================

# Enable debug logging
export G_MESSAGES_DEBUG=all

# Show Flatpak internal operations
export FLATPAK_DEBUG=1

# Offline mode (for testing without dependencies)
export CARGO_NET_OFFLINE=true


# ============================================================================
# COMMON ISSUES & SOLUTIONS
# ============================================================================

# Issue: Build fails with "No matching version"
# Solution: Update runtime-version in org.commdesk.CommDesk.json

# Issue: Permission denied errors
# Solution: Add required permissions to finish-args in manifest

# Issue: Rust compilation errors
# Solution: Install Rust extension:
flatpak install flathub org.freedesktop.Sdk.Extension.rust-stable//25.08

# Issue: Node/pnpm not found
# Solution: Install Node extension:
flatpak install flathub org.freedesktop.Sdk.Extension.node20//25.08

# Issue: App won't start
# Solution: Check logs:
G_MESSAGES_DEBUG=all flatpak run org.commdesk.CommDesk 2>&1


# ============================================================================
# RESOURCES
# ============================================================================

# Official Flatpak docs: https://docs.flatpak.org/
# Manifest reference: https://docs.flatpak.org/en/latest/reference.html
# Flathub submit: https://docs.flathub.org/docs/for-app-authors/submission/
# Tauri Flatpak: https://tauri.app/develop/distributing-packages/#flatpak
