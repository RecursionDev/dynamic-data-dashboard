const esbuild = require("esbuild");
const fs = require("fs");

fs.mkdirSync("dist", { recursive: true });

esbuild.build({
  entryPoints: ["src/main.jsx"],
  bundle: true,
  outfile: "dist/bundle.js",
  loader: {
    ".jsx": "jsx",
    ".js": "jsx",
    ".css": "css",
    ".png": "file",
    ".svg": "file"
  },
  assetNames: "assets/[name]-[hash]",
  sourcemap: true
}).then(() => {
  fs.copyFileSync("index.html", "dist/index.html");
  console.log("Frontend build completed successfully!");
}).catch(() => {
  process.exit(1);
});
