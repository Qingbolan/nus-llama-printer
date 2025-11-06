
# EasyPaper

> Paper Management Platform for VLDB - Python CLI wrapper

[![PyPI version](https://badge.fury.io/py/EasyPaper.svg)](https://badge.fury.io/py/EasyPaper)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

EasyPaper is a desktop application for managing academic papers and author information. This Python package provides a convenient command-line interface to download and launch the application.

## Features

- Import and manage academic papers from Excel
- Track author profiles and affiliations
- Visualize paper metadata and statistics
- Export organized datasets with custom formatting
- Cross-platform desktop application (macOS, Windows, Linux)
- Simple one-command installation via pip

## Installation

### Quick Install

```bash
pip install EasyPaper
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

## How It Works

This Python package is a lightweight wrapper (~50 KB) that:

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
└── python-pip/        # Python CLI wrapper
    ├── easy_paper/
    │   ├── __init__.py
    │   ├── cli.py         # CLI entry point
    │   ├── config.py      # Configuration
    │   └── downloader.py  # Binary downloader
    └── pyproject.toml
```

### Building from Source

To build the desktop application from source:

```bash
cd app
npm install
npm run tauri:build
```

### Publishing to PyPI

```bash
cd python-pip

# Build the package
python -m build

# Upload to PyPI
twine upload dist/*
```

## Requirements

- Python 3.8+
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

### Manual Installation

You can also download binaries directly from [GitHub Releases](https://github.com/Qingbolan/EasyPaper/releases).

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
