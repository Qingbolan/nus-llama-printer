# EasyPaper

> Paper Management Platform for VLDB - Node.js CLI wrapper

[![npm version](https://badge.fury.io/js/EasyPaper.svg)](https://badge.fury.io/js/EasyPaper)
[![Node.js](https://img.shields.io/node/v/EasyPaper.svg)](https://www.npmjs.com/package/EasyPaper)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

EasyPaper is a desktop application for managing academic papers and author information. This Node.js package provides a convenient command-line interface to download and launch the application.

## Features

- 📚 Import and manage academic papers from Excel
- 👥 Track author profiles and affiliations
- 📊 Visualize paper metadata and statistics
- 📤 Export organized datasets with custom formatting
- 🖥️ Cross-platform desktop application (macOS, Windows, Linux)
- 🚀 Simple one-command installation via npm

## Installation

### Global Installation (Recommended)

```bash
npm install -g EasyPaper
```

### Local Installation

```bash
npm install EasyPaper
npx EasyPaper
```

### Platform Support

- **macOS**: Apple Silicon (ARM64) and Intel (x86_64)
- **Windows**: x64
- **Linux**: x64

## Usage

### Launch the Application

Simply run:

```bash
EasyPaper
```

On first run, the application binary will be automatically downloaded (~50-150 MB depending on platform). The binary is stored in `~/.EasyPaper/` for future use.

### Command-Line Options

```bash
# Show help
EasyPaper --help

# Show version
EasyPaper --version

# Force reinstall the binary
EasyPaper --install

# Show binary installation path
EasyPaper --path
```

### Use in npm Scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "vldb": "EasyPaper"
  }
}
```

Then run:
```bash
npm run vldb
```

## How It Works

This Node.js package is a lightweight wrapper (~20 KB + dependencies) that:

1. Detects your operating system and architecture
2. Downloads the appropriate pre-built binary from GitHub Releases (only on first run)
3. Launches the desktop application

The actual application is built with:
- **Frontend**: React + TypeScript
- **Backend**: Tauri (Rust)
- **UI**: Ant Design + Fluent UI

## Development

### Project Structure

```
EasyPaper/
├── app/                    # Tauri desktop application
│   ├── src/               # React frontend
│   └── src-tauri/         # Rust backend
└── node-wrapper/          # Node.js CLI wrapper
    ├── lib/
    │   ├── cli.js         # CLI entry point
    │   ├── config.js      # Configuration
    │   └── downloader.js  # Binary downloader
    ├── test/
    └── package.json
```

### Building from Source

To build the desktop application from source:

```bash
cd app
npm install
npm run tauri:build
```

### Testing Locally

```bash
cd node-wrapper

# Install dependencies
npm install

# Run tests
npm test

# Test CLI locally
node lib/cli.js --version
```

### Publishing to npm

```bash
cd node-wrapper

# Login to npm
npm login

# Publish
npm publish
```

## Requirements

- Node.js 14.0.0 or higher
- Internet connection (for initial binary download)

## Configuration

The package stores data in:
- **Binary**: `~/.EasyPaper/bin/`
- **Version**: `~/.EasyPaper/version.txt`

## Troubleshooting

### Download Issues

If download fails, try:
```bash
EasyPaper --install
```

### Permission Issues (Linux/macOS)

If the binary is not executable:
```bash
chmod +x ~/.EasyPaper/bin/EasyPaper
```

### Node.js Version

Ensure you're using Node.js 14 or higher:
```bash
node --version
```

### Manual Installation

You can also download binaries directly from [GitHub Releases](https://github.com/Qingbolan/EasyPaper/releases).

## API

### Programmatic Usage

You can also use the package programmatically:

```javascript
const { checkAndInstall, getBinaryPath } = require('EasyPaper/lib/downloader');

// Check and install binary
await checkAndInstall();

// Get binary path
const binaryPath = getBinaryPath();
console.log(`Binary location: ${binaryPath}`);
```

## License

MIT License - see LICENSE file for details

## Author

**Silan Hu**
- Email: silan.hu@u.nus.edu
- GitHub: [@Qingbolan](https://github.com/Qingbolan)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

Built with:
- [Tauri](https://tauri.app/) - Desktop application framework
- [React](https://react.dev/) - UI library
- [Ant Design](https://ant.design/) - UI components
- [Fluent UI](https://developer.microsoft.com/en-us/fluentui) - Microsoft design system
- [Node.js](https://nodejs.org/) - JavaScript runtime

## Related Packages

- **Python**: `pip install EasyPaper` - Python wrapper for the same application

## Support

- 🐛 [Report Issues](https://github.com/Qingbolan/EasyPaper/issues)
- 📖 [Documentation](https://github.com/Qingbolan/EasyPaper/wiki)
- 💬 [Discussions](https://github.com/Qingbolan/EasyPaper/discussions)
