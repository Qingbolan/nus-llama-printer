import { homeDir, documentDir } from "@tauri-apps/api/path"

/**
 * Get the default project location
 * Priority:
 * 1. User's custom setting (from store)
 * 2. ~/Documents/EasyPaper (macOS/Linux)
 * 3. C:\Users\[User]\Documents\EasyPaper (Windows)
 */
export async function getDefaultProjectLocation(customLocation?: string): Promise<string> {
  if (customLocation) {
    return customLocation
  }

  try {
    // Try to get Documents directory
    const docsDir = await documentDir()
    if (docsDir) {
      // Ensure proper path separator (docsDir usually ends with /)
      return docsDir.endsWith('/') ? `${docsDir}EasyPaper` : `${docsDir}/EasyPaper`
    }
  } catch (e) {
    console.warn("Could not get documents directory, using fallback:", e)
  }

  try {
    // Fallback to home directory
    const home = await homeDir()
    if (home) {
      // Ensure proper path separator
      return home.endsWith('/') ? `${home}Documents/EasyPaper` : `${home}/Documents/EasyPaper`
    }
  } catch (e) {
    console.warn("Could not get home directory, using fallback:", e)
  }

  // Last resort fallback
  return "/Users/macbook.silan.tech/Documents/EasyPaper"
}

/**
 * Initialize default location if not set
 */
export async function initializeDefaultLocation(): Promise<string> {
  const defaultLocation = await getDefaultProjectLocation()
  return defaultLocation
}
