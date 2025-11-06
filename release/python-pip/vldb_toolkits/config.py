"""Configuration for EasyPaper"""

from pathlib import Path

# Version
VERSION = "0.1.2"

# GitHub repository
GITHUB_REPO = "Qingbolan/EasyPaper"
GITHUB_API_URL = f"https://api.github.com/repos/{GITHUB_REPO}/releases/latest"

# Local installation paths
HOME_DIR = Path.home()
INSTALL_DIR = HOME_DIR / ".EasyPaper"
BINARY_DIR = INSTALL_DIR / "bin"
VERSION_FILE = INSTALL_DIR / "version.txt"

# Platform-specific binary names and configurations
# Note: For Linux, multiple formats are available (AppImage, DEB, RPM).
# This wrapper uses AppImage for maximum compatibility across distributions.
# For DEB/RPM installation, download directly from GitHub Releases.
#
# For Windows, NSIS installer is preferred as it includes smart detection
# and can launch existing installations without reinstalling.
PLATFORM_BINARIES = {
    "darwin_arm64": {
        "asset_name": "EasyPaper_macos_aarch64.app.tar.gz",
        "executable_path": "EasyPaper.app/Contents/MacOS/EasyPaper",
        "is_bundle": True,
        "description": "macOS Apple Silicon (M1/M2/M3)"
    },
    "darwin_x86_64": {
        "asset_name": "EasyPaper_macos_x86_64.app.tar.gz",
        "executable_path": "EasyPaper.app/Contents/MacOS/EasyPaper",
        "is_bundle": True,
        "description": "macOS Intel"
    },
    "linux_x86_64": {
        "asset_name": "EasyPaper_linux_x86_64.AppImage",
        "executable_path": "EasyPaper",
        "is_bundle": False,
        "description": "Linux (AppImage - universal format)",
        "alternatives": [
            "EasyPaper_linux_x86_64.deb (Debian/Ubuntu)",
            "EasyPaper_linux_x86_64.rpm (Fedora/RHEL)"
        ]
    },
    "windows_x86_64": {
        # Prefer NSIS installer (has smart detection and launch capabilities)
        "asset_name": "EasyPaper_windows_x86_64_setup.exe",
        "asset_name_fallback": "EasyPaper_windows_x86_64.msi",
        "executable_path": "EasyPaper.exe",
        "is_bundle": False,
        "description": "Windows 10/11 (64-bit)",
        "installer_type": "nsis"  # or "msi" for fallback
    }
}

def ensure_dirs():
    """Ensure installation directories exist"""
    INSTALL_DIR.mkdir(parents=True, exist_ok=True)
    BINARY_DIR.mkdir(parents=True, exist_ok=True)
