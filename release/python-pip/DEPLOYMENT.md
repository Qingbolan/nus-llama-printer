# Deployment Guide

This guide covers how to build, test, and publish the EasyPaper Python package.

## Prerequisites

1. **GitHub Repository Setup**

   - Update repository URL in `python-pip/easy_paper/config.py`:
     ```python
     GITHUB_REPO = "Qingbolan/EasyPaper"
     ```
   - Update URLs in `python-pip/pyproject.toml`
2. **GitHub Secrets**

   - `PYPI_API_TOKEN`: Your PyPI API token
   - `TEST_PYPI_API_TOKEN`: (Optional) TestPyPI token for testing
3. **PyPI Account**

   - Register at https://pypi.org
   - Create API token: Account Settings → API tokens

## Build Process

### Step 1: Build Desktop Application

Build binaries for all platforms using GitHub Actions:

```bash
# Tag a new version
git tag v0.1.0
git push origin v0.1.0

# This triggers the GitHub Actions workflow which:
# 1. Builds binaries for macOS (ARM + Intel), Windows, Linux
# 2. Creates GitHub Release
# 3. Uploads binary assets
# 4. Publishes to PyPI
```

### Step 2: Manual Build (Optional)

If you prefer manual builds:

#### macOS

```bash
cd app
npm install
npm run tauri:build

# Package the .app
cd src-tauri/target/release/bundle/macos
tar -czf EasyPaper_macos_aarch64.app.tar.gz EasyPaper.app
```

#### Windows

```bash
cd app
npm install
npm run tauri:build

# Find the .msi in src-tauri/target/release/bundle/msi/
```

#### Linux

```bash
cd app
npm install
npm run tauri:build

# Find the .AppImage in src-tauri/target/release/bundle/appimage/
```

### Step 3: Upload to GitHub Releases

1. Go to: https://github.com/Qingbolan/EasyPaper/releases
2. Click "Draft a new release"
3. Create tag: `v0.1.0`
4. Upload these files:
   - `EasyPaper_macos_aarch64.app.tar.gz`
   - `EasyPaper_macos_x86_64.app.tar.gz`
   - `EasyPaper_windows_x86_64.msi`
   - `EasyPaper_linux_x86_64.AppImage`

## Testing

### Local Testing

```bash
cd python-pip

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install in editable mode
pip install -e .

# Test CLI
EasyPaper --help
EasyPaper --version

# Test download (will fail until binaries are on GitHub Releases)
EasyPaper --install
```

### Test Package Build

```bash
cd python-pip

# Install build tools
pip install build twine

# Build package
python -m build

# Check package
twine check dist/*

# Test upload to TestPyPI
twine upload --repository testpypi dist/*

# Test install from TestPyPI
pip install --index-url https://test.pypi.org/simple/ EasyPaper
```

## Publishing to PyPI

### Automatic (via GitHub Actions)

Simply push a tag:

```bash
git tag v0.1.0
git push origin v0.1.0
```

The workflow will automatically:

1. Build all platform binaries
2. Create GitHub Release
3. Publish to PyPI

### Manual Publishing

```bash
cd python-pip

# Build
python -m build

# Upload to PyPI
twine upload dist/*

# Enter your PyPI token when prompted
```

## Version Management

Update version in these files:

1. `python-pip/pyproject.toml` → `version`
2. `python-pip/easy_paper/__init__.py` → `__version__`
3. `python-pip/easy_paper/config.py` → `VERSION`
4. `app/package.json` → `version`
5. `app/src-tauri/tauri.conf.json` → `version`

## Troubleshooting

### Binary Download Issues

Make sure:

- GitHub Release exists with correct tag
- Assets are named exactly as specified in `config.py`
- Repository is public or you have proper access tokens

### PyPI Upload Fails

Common issues:

- Version already exists (increment version)
- Invalid API token (regenerate)
- Package name already taken (choose different name)

### Platform-Specific Builds

#### macOS Code Signing

For distribution, you may need to sign the app:

```bash
codesign --deep --force --verify --verbose --sign "Developer ID Application: Your Name" EasyPaper.app
```

#### Windows Code Signing

Use `signtool` from Windows SDK:

```bash
signtool sign /f certificate.pfx /p password EasyPaper.exe
```

## Distribution Checklist

Before releasing:

- [ ] Update version in all files
- [ ] Test build on all platforms
- [ ] Update CHANGELOG.md
- [ ] Test Python package locally
- [ ] Upload binaries to GitHub Releases
- [ ] Verify download URLs work
- [ ] Test `pip install EasyPaper`
- [ ] Update documentation
- [ ] Create release notes

## Continuous Deployment

The GitHub Actions workflow handles:

1. ✅ Multi-platform builds
2. ✅ GitHub Releases creation
3. ✅ PyPI publishing
4. ✅ Automated versioning

To customize:

- Edit `.github/workflows/build-release.yml`
- Add platform-specific steps
- Configure release notes template

## Support

For issues:

- Desktop app: Build in `app/` directory
- Python package: Issues in `python-pip/`
- CI/CD: Check GitHub Actions logs
