# npm Deployment Guide

This guide covers how to build, test, and publish the EasyPaper npm package.

## Prerequisites

1. **GitHub Repository Setup**
   - Update repository URL in `node-wrapper/lib/config.js`:
     ```javascript
     const GITHUB_REPO = 'Qingbolan/EasyPaper';
     ```
   - Update URLs in `node-wrapper/package.json`

2. **npm Account**
   - Register at https://www.npmjs.com
   - Verify your email address

3. **GitHub Secrets**
   - `NPM_TOKEN`: Your npm access token

## Getting npm Token

1. Login to npm:
   ```bash
   npm login
   ```

2. Create access token:
   ```bash
   npm token create
   ```
   Or via web: https://www.npmjs.com/settings/YOUR_USERNAME/tokens

3. Add to GitHub Secrets:
   - Go to: GitHub repo → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Your npm token

## Build Process

### Automatic Build (GitHub Actions)

Simply push a tag:

```bash
git tag v0.1.0
git push origin v0.1.0
```

This will:
1. ✅ Build desktop binaries for all platforms
2. ✅ Create GitHub Release
3. ✅ Publish to PyPI
4. ✅ Publish to npm

### Manual Build

#### Step 1: Build Desktop Application

See main `QUICK_START.md` for details.

#### Step 2: Upload Binaries to GitHub Releases

Ensure binaries are available at:
- `EasyPaper_macos_aarch64.app.tar.gz`
- `EasyPaper_macos_x86_64.app.tar.gz`
- `EasyPaper_windows_x86_64.msi`
- `EasyPaper_linux_x86_64.AppImage`

#### Step 3: Publish npm Package

```bash
cd node-wrapper

# Login to npm
npm login

# Test the package
npm test

# Pack to see what will be published
npm pack --dry-run

# Publish
npm publish
```

## Local Testing

```bash
cd node-wrapper

# Run test script
./test_local.sh
```

This will:
- Check Node.js version
- Install dependencies
- Run tests
- Test CLI commands
- Validate package structure

### Test Global Installation

```bash
# Link package globally
npm link

# Test CLI
EasyPaper --version
EasyPaper --help

# Unlink when done
npm unlink -g EasyPaper
```

### Test as Dependency

```bash
# In another directory
mkdir test-project
cd test-project
npm init -y

# Install local package
npm install /path/to/node-wrapper

# Test
npx EasyPaper --version
```

## Version Management

Update version in:
1. `node-wrapper/package.json` → `version`
2. `node-wrapper/lib/config.js` → `VERSION`
3. Also update Python package versions if needed

```bash
# Using npm version command
cd node-wrapper
npm version patch  # 0.1.0 -> 0.1.1
npm version minor  # 0.1.1 -> 0.2.0
npm version major  # 0.2.0 -> 1.0.0
```

## Publishing Workflow

### First Time Setup

1. Update `GITHUB_REPO` in `lib/config.js`
2. Update URLs in `package.json`
3. Login to npm: `npm login`
4. Get npm token and add to GitHub Secrets
5. Test locally: `./test_local.sh`

### Release New Version

1. **Update versions**:
   ```bash
   cd node-wrapper
   npm version patch
   ```

2. **Commit and tag**:
   ```bash
   git add .
   git commit -m "Release v0.1.1"
   git tag v0.1.1
   git push origin main --tags
   ```

3. **Wait for GitHub Actions** to complete

4. **Verify**:
   - Check npm: https://www.npmjs.com/package/EasyPaper
   - Test install: `npm install -g EasyPaper`

## Package Scopes (Optional)

If `EasyPaper` is taken, you can use a scope:

```json
{
  "name": "@yourname/EasyPaper",
  "bin": {
    "EasyPaper": "lib/cli.js"
  }
}
```

Users install with:
```bash
npm install -g @yourname/EasyPaper
```

## Troubleshooting

### Package Name Already Taken

Options:
1. Use a scope: `@yourname/EasyPaper`
2. Choose different name: `vldb-toolkit`, `vldb-papers`, etc.

### Version Already Published

npm doesn't allow republishing same version. Options:
1. Increment version: `npm version patch`
2. Use `npm unpublish` (only within 72 hours)

### Login Issues

```bash
# Clear npm cache
npm cache clean --force

# Re-login
npm logout
npm login
```

### Token Expired

1. Generate new token on npmjs.com
2. Update GitHub Secret `NPM_TOKEN`

## Package Size

Check package size before publishing:

```bash
npm pack --dry-run

# Or actually pack and check
npm pack
tar -tzf EasyPaper-0.1.0.tgz
```

npm has a 10MB package size limit by default. Our package should be ~20-50KB (excluding node_modules).

## Distribution Tags

Publish beta versions:

```bash
# Publish as beta
npm publish --tag beta

# Users install with
npm install EasyPaper@beta

# Promote to latest
npm dist-tag add EasyPaper@0.1.0 latest
```

## Security

### Best Practices

1. **Never commit tokens** to git
2. Use **npm automation tokens** for CI/CD
3. Enable **2FA** on npm account
4. Regularly **rotate tokens**

### Package Integrity

```bash
# Generate checksums
npm pack
shasum -a 256 EasyPaper-0.1.0.tgz
```

## Maintenance

### Update Dependencies

```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Update to latest
npm install tar@latest
```

### Deprecate Old Versions

```bash
npm deprecate EasyPaper@0.0.1 "Please upgrade to 0.1.0+"
```

### Unpublish (Emergency Only)

```bash
# Only within 72 hours
npm unpublish EasyPaper@0.1.0

# Unpublish entire package (use with caution!)
npm unpublish EasyPaper --force
```

## CI/CD Pipeline

The GitHub Actions workflow:

1. **On tag push** (`v*`):
   - Builds desktop apps for all platforms
   - Creates GitHub Release with binaries
   - Publishes to PyPI
   - Publishes to npm

2. **Manual trigger**:
   - Go to: Actions → Build and Release → Run workflow
   - Enter version tag

## Support

- npm package: https://www.npmjs.com/package/EasyPaper
- GitHub Issues: https://github.com/Qingbolan/EasyPaper/issues
- npm docs: https://docs.npmjs.com/
