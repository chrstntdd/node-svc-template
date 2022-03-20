import { build } from "esbuild"

import pkg from "../package.json" assert { type: "json" }

await build({
  entryPoints: ["src/main"],
  external: Object.keys({ ...pkg.dependencies, ...pkg.devDependencies }),
  outdir: "dist",
  bundle: true,
  target: "esnext",
  platform: "node",
  format: "esm"
})
