#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve(process.cwd())
const iconsDir = path.join(root, 'src-tauri', 'icons')
const publicDir = path.join(root, 'public')

async function exists(p) {
  try { await fs.stat(p); return true } catch { return false }
}

async function main() {
  const src1 = path.join(iconsDir, 'app-icon.png') // preferred if present (likely the latest 1024x1024)
  const src2 = path.join(iconsDir, 'icon.png')     // generated 512x512 from `tauri icon`
  const dst = path.join(publicDir, 'logo.png')

  let src = null
  if (await exists(src1)) src = src1
  else if (await exists(src2)) src = src2

  if (!src) {
    console.error('[assets:logo] No source icon found. Expected one of:', src1, 'or', src2)
    process.exit(1)
  }

  await fs.mkdir(publicDir, { recursive: true })
  await fs.copyFile(src, dst)
  const { size } = await fs.stat(dst)
  console.log(`[assets:logo] Synced ${path.relative(root, src)} -> ${path.relative(root, dst)} (${size} bytes)`) 
}

main().catch((e) => {
  console.error('[assets:logo] Failed:', e)
  process.exit(1)
})

