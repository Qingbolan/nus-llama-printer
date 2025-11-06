# Build and Release Guide for EasyPaper

This guide explains how to build and release EasyPaper for all supported platforms.

## Overview

EasyPaper uses a multi-platform build strategy with GitHub Actions to create:
- **macOS**: DMG (x86_64 and ARM64)
- **Windows**: NSIS and MSI installers
- **Linux**: AppImage, DEB, and RPM packages

## Prerequisites

### Development Environment

#### All Platforms
- **Node.js**: 20.x or later
- **Rust**: Latest stable (via rustup)
- **Tauri CLI**: Installed via cargo

#### macOS
- **Xcode**: Latest version
- **Command Line Tools**: `xcode-select --install`

#### Windows
- **Visual Studio 2022**: With C++ build tools
- **Windows SDK**: Latest version
- **WebView2**: Runtime for testing

#### Linux (Ubuntu 20.04 Recommended)
```bash
sudo apt update
sudo apt install -y \
  libwebkit2gtk-4.0-dev \
  libwebkit2gtk-4.1-dev \
  libgtk-3-dev \
  build-essential \
  curl wget file \
  libssl-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev \
  patchelf
```

## Local Development Build

### Setup

```bash
# Clone repository
git clone https://github.com/yourusername/EasyPaper.git
cd EasyPaper/app

# Install dependencies
npm install

# Install Rust (if not already installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Tauri CLI
cargo install tauri-cli
```

### Development Mode

```bash
# Run in development mode (hot reload)
npm run tauri:dev
```

### Production Build

```bash
# Build for current platform
npm run tauri:build

# Build output locations:
# macOS: src-tauri/target/release/bundle/dmg/
# Windows: src-tauri/target/release/bundle/msi/ and src-tauri/target/release/bundle/nsis/
# Linux: src-tauri/target/release/bundle/appimage/, deb/, rpm/
```

## Cross-Platform Builds

### Building for Linux (from Ubuntu 20.04)

```bash
# Ensure all dependencies are installed
sudo apt install -y \
  libwebkit2gtk-4.0-dev \
  libwebkit2gtk-4.1-dev \
  libgtk-3-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev \
  patchelf

# Build
cd app
npm install
npm run tauri:build

# This creates:
# - AppImage: src-tauri/target/release/bundle/appimage/*.AppImage
# - DEB: src-tauri/target/release/bundle/deb/*.deb
# - RPM: src-tauri/target/release/bundle/rpm/*.rpm
```

### Building for macOS Universal Binary

```bash
# Add ARM64 target
rustup target add aarch64-apple-darwin

# Build for both architectures
npm run tauri:build -- --target x86_64-apple-darwin
npm run tauri:build -- --target aarch64-apple-darwin

# Create universal binary (optional)
lipo -create \
  src-tauri/target/x86_64-apple-darwin/release/EasyPaper \
  src-tauri/target/aarch64-apple-darwin/release/EasyPaper \
  -output src-tauri/target/universal/EasyPaper
```

### Building for Windows

```bash
# From Windows machine
cd app
npm install
npm run tauri:build

# This creates both:
# - NSIS installer: src-tauri/target/release/bundle/nsis/*.exe
# - MSI installer: src-tauri/target/release/bundle/msi/*.msi
```

## Automated Release Process (GitHub Actions)

### Version Management

1. **Update version** in all required files:
   ```bash
   # app/package.json
   # app/src-tauri/Cargo.toml
   # app/src-tauri/tauri.conf.json
   # release/python-pip/pyproject.toml
   # release/node.js-npm/package.json
   ```

2. **Commit changes**:
   ```bash
   git add .
   git commit -m "chore: bump version to v0.2.0"
   git push
   ```

3. **Create and push tag**:
   ```bash
   git tag v0.2.0
   git push origin v0.2.0
   ```

### Automated Build Flow

When you push a tag (e.g., `v0.2.0`), GitHub Actions will:

1. **Build for all platforms**:
   - macOS (x86_64 and ARM64)
   - Windows (x86_64)
   - Linux (x86_64) on Ubuntu 20.04 for compatibility

2. **Create packages**:
   - macOS: `.tar.gz` archives of `.app` bundles
   - Windows: `.msi` and `.nsis.exe` installers
   - Linux: `.AppImage`, `.deb`, `.rpm`

3. **Create GitHub Release**:
   - Tag: `v0.2.0`
   - Title: `Release v0.2.0`
   - Auto-generated release notes
   - All build artifacts attached

4. **Publish packages**:
   - PyPI: `EasyPaper` (Python wrapper)
   - npm: `EasyPaper` (Node.js wrapper)

### Manual Workflow Dispatch

You can also trigger builds manually:

1. Go to **Actions** → **Build and Release**
2. Click **Run workflow**
3. Enter version tag (e.g., `v0.2.0`)
4. Click **Run workflow**

## Build Configuration

### Tauri Configuration (`app/src-tauri/tauri.conf.json`)

Key settings for multi-platform builds:

```json
{
  "bundle": {
    "targets": ["appimage", "deb", "rpm", "dmg", "msi", "nsis"],
    "linux": {
      "deb": {
        "depends": [
          "libwebkit2gtk-4.1-0 | libwebkit2gtk-4.0-37",
          "libgtk-3-0",
          "libayatana-appindicator3-1",
          "librsvg2-2",
          "libssl3 | libssl1.1"
        ]
      },
      "rpm": {
        "depends": [
          "webkit2gtk4.1",
          "gtk3",
          "libappindicator-gtk3",
          "librsvg2",
          "openssl-libs"
        ]
      }
    },
    "windows": {
      "nsis": {
        "template": "installer.nsi",
        "languages": ["English", "SimpChinese"],
        "installMode": "perMachine"
      }
    }
  }
}
```

### GitHub Actions Configuration (`.github/workflows/build-release.yml`)

Important settings:

- **Linux**: Uses Ubuntu 20.04 for better glibc compatibility
- **Windows**: Builds both MSI and NSIS
- **macOS**: Separate builds for x86_64 and ARM64

## Linux Compatibility Strategy

### Build on Older Base System

We build on **Ubuntu 20.04** to ensure compatibility with:
- Ubuntu 20.04+ (all LTS versions)
- Debian 11+ (Bullseye and later)
- Fedora 32+
- RHEL 8+
- Other distributions with glibc 2.31+

### Multiple Package Formats

1. **AppImage** (recommended for broadest compatibility):
   - Self-contained
   - No installation required
   - Works on most distributions

2. **DEB** (Debian/Ubuntu ecosystem):
   - Automatic dependency resolution
   - Integrated with system package manager
   - Supports both WebKitGTK 4.0 and 4.1

3. **RPM** (Fedora/RHEL ecosystem):
   - Native package format
   - Dependency management
   - Standard installation path

## Windows Installer Features

### NSIS Installer

Our custom NSIS installer (`app/src-tauri/installer.nsi`) includes:

1. **Installation Detection**:
   - Checks registry for existing installation
   - Displays current version
   - Offers to launch or reinstall

2. **Smart Launching**:
   - If app is installed, can launch it directly
   - No need to run through full install process

3. **Multilingual Support**:
   - English
   - Simplified Chinese

4. **WebView2 Auto-Download**:
   - Automatically downloads and installs WebView2 if missing

### MSI Installer

- Standard Windows Installer format
- Enterprise deployment support
- Group Policy compatible
- Silent installation support

## Testing Builds

### Local Testing

Before releasing, test on:

- **macOS**:
  - Intel Mac (if available)
  - Apple Silicon Mac
  - Test DMG installation

- **Windows**:
  - Windows 10 (latest)
  - Windows 11
  - Test both NSIS and MSI installers
  - Test with and without WebView2 pre-installed

- **Linux**:
  - Ubuntu 20.04 (minimum supported)
  - Ubuntu 22.04 or 24.04 (latest LTS)
  - Fedora (latest)
  - Test AppImage, DEB, and RPM
  - Run dependency check script

### Dependency Testing on Linux

```bash
# Test the dependency check script
cd app/src-tauri
chmod +x check-linux-deps.sh
./check-linux-deps.sh
```

## Release Checklist

- [ ] Update version in all files
- [ ] Update CHANGELOG.md
- [ ] Test builds locally on all platforms
- [ ] Commit and push changes
- [ ] Create and push version tag
- [ ] Monitor GitHub Actions build
- [ ] Test downloaded artifacts from GitHub Release
- [ ] Verify PyPI and npm package publication
- [ ] Update documentation if needed
- [ ] Announce release

## Troubleshooting Build Issues

### Linux: "libwebkit2gtk not found"

```bash
# Install both versions for compatibility
sudo apt install libwebkit2gtk-4.0-dev libwebkit2gtk-4.1-dev
```

### macOS: "Code signing failed"

For development:
```json
// In tauri.conf.json
{
  "bundle": {
    "macOS": {
      "signingIdentity": null
    }
  }
}
```

For distribution, you need an Apple Developer ID.

### Windows: "WebView2 not found during build"

WebView2 SDK should be auto-downloaded. If not:
```bash
# Clear Tauri cache
cargo clean
# Rebuild
npm run tauri:build
```

### Linux: "rpm build fails"

Install rpmbuild:
```bash
sudo apt install rpm
```

## Advanced Topics

### Custom Build Targets

```bash
# Linux: Build only AppImage
npm run tauri:build -- --bundles appimage

# Linux: Build only DEB
npm run tauri:build -- --bundles deb

# macOS: Build for specific architecture
npm run tauri:build -- --target aarch64-apple-darwin

# Windows: Build only NSIS
npm run tauri:build -- --bundles nsis
```

### Debug Builds

```bash
# Build in debug mode (faster, larger binary)
npm run tauri:build -- --debug
```

### Custom Installer Branding

Edit:
- `app/src-tauri/installer.nsi` (NSIS)
- `app/src-tauri/icons/` (Icons)
- `app/src-tauri/tauri.conf.json` (Metadata)

## Continuous Integration

### Build Matrix

Our CI builds on:
- `ubuntu-20.04` (Linux - for glibc compatibility)
- `windows-latest` (Windows - latest stable)
- `macos-latest` (macOS - separate jobs for x86_64 and ARM64)

### Artifacts

All artifacts are:
1. Uploaded to GitHub Actions (for inspection)
2. Attached to GitHub Release (for distribution)
3. Available for PyPI/npm publishing

## Distribution Channels

After building:

1. **GitHub Releases**: All installers/packages
2. **PyPI**: Python wrapper package
3. **npm**: Node.js wrapper package
4. **(Optional) Flathub**: Flatpak submission
5. **(Optional) Snapcraft**: Snap package

## Getting Help

If you encounter build issues:

1. Check this guide
2. Review CI logs in GitHub Actions
3. Search [GitHub Issues](https://github.com/yourusername/EasyPaper/issues)
4. Create a new issue with:
   - Platform and version
   - Build command used
   - Full error output

---

**Last Updated**: 2025-01-24
