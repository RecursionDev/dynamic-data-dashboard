
const http = require("http");
const fs = require("fs");
const path = require("path");

const distFolder = path.join(__dirname, "dist");

const mimeTypes = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(
    new URL(req.url, "http://localhost").pathname
  );

  const requestPath = pathname === "/" ? "/index.html" : pathname;

const filePath = path.resolve(distFolder, "." + requestPath);

  if (!filePath.startsWith(distFolder + path.sep) &&
      filePath !== path.join(distFolder, "index.html")) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.stat(filePath, (error, stats) => {
    if (!error && stats.isFile()) {
      const contentType =
        mimeTypes[path.extname(filePath)] || "application/octet-stream";

      res.writeHead(200, { "Content-Type": contentType });
      return fs.createReadStream(filePath).pipe(res);
    }

    const acceptsHtml = req.headers.accept?.includes("text/html");

    if (acceptsHtml) {
      res.writeHead(200, { "Content-Type": "text/html" });
      return fs.createReadStream(
        path.join(distFolder, "index.html")
      ).pipe(res);
    }

    res.writeHead(404);
    res.end("File not found");
  });
});

server.listen(3000, () => {
  console.log("Frontend running at http://localhost:3000");
});
