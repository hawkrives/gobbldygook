// Serves the production build of gob-web for the Playwright suite.
// Unknown paths fall back to index.html, like Netlify's SPA redirect.

import { createReadStream, existsSync } from "node:fs"
import { stat } from "node:fs/promises"
import { createServer } from "node:http"
import { extname, join, normalize } from "node:path"
import { fileURLToPath } from "node:url"

const root = fileURLToPath(
  new URL("../modules/gob-web/build/", import.meta.url),
)
const port = Number(process.env.PORT || 4173)

if (!existsSync(join(root, "index.html"))) {
  console.error(`No build found in ${root}. Run \`mise run build\` first.`)
  process.exit(1)
}

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".map": "application/json",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".url": "text/plain; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
}

async function resolveFile(urlPath) {
  let file = normalize(join(root, decodeURIComponent(urlPath)))
  if (!file.startsWith(root)) {
    return null
  }
  try {
    let info = await stat(file)
    if (info.isFile()) {
      return file
    }
  } catch {
    // fall through to the SPA fallback
  }
  return join(root, "index.html")
}

createServer(async (req, res) => {
  let { pathname } = new URL(req.url, "http://localhost")
  let file = await resolveFile(pathname)
  if (!file) {
    res.writeHead(403).end()
    return
  }
  res.writeHead(200, {
    "Content-Type": types[extname(file)] || "application/octet-stream",
  })
  createReadStream(file).pipe(res)
}).listen(port, () => {
  console.log(`serving ${root} on http://localhost:${port}`)
})
