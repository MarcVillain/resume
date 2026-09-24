const fs = require("fs");
const http = require("http");
const path = require("path");
const builder = require("./builder");

const ROOT_DIR = path.join(__dirname, "..");

const CONTENT_TYPES = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".png": "image/png",
    ".jpg": "image/jpg",
};

function serveIndex(input, response) {
    try {
        const html = builder.render(input);
        response.writeHead(200, { "Content-Type": "text/html" });
        response.end(html, "utf-8");
    } catch (err) {
        response.writeHead(500, { "Content-Type": "text/plain" });
        response.end(`Error: ${err.message}`);
    }
}

function serveStaticFile(requestUrl, response) {
    const filePath = path.join(ROOT_DIR, requestUrl);
    const contentType = CONTENT_TYPES[path.extname(filePath)] || "application/octet-stream";

    fs.readFile(filePath, (err, content) => {
        if (err) {
            response.writeHead(404, { "Content-Type": "text/plain" });
            response.end("Not found");
            return;
        }
        response.writeHead(200, { "Content-Type": contentType });
        response.end(content, "utf-8");
    });
}

/**
 * Serve the resume at `http://host:port`, re-rendering it from `input` on every
 * request so edits to the resume data or templates show up on refresh.
 */
function serve({ input = "resume.json", port = 8000, host = "127.0.0.1", open = true } = {}) {
    const server = http.createServer((request, response) => {
        if (request.url === "/") {
            serveIndex(input, response);
            return;
        }
        serveStaticFile(request.url, response);
    });

    server.listen(port, host, () => {
        const url = `http://${host}:${port}`;
        console.log(`Resume server running at ${url}`);

        if (open) {
            require("opn")(url);
        }
    });

    return server;
}

module.exports = {
    serve,
};
