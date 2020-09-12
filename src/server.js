const fs = require("fs");
const http = require("http");
const path = require("path");
const builder = require("./builder")

function serve() {
    http.createServer(function (request, response) {
        console.log("Starting server...");

        let filePath = "." + request.url;
        if (filePath === "./")
            filePath = __dirname + "/../index.html";

        const extname = path.extname(filePath);
        let contentType = "text/html";
        switch (extname) {
            case ".js":
                contentType = "text/javascript";
                break;
            case ".css":
                contentType = "text/css";
                break;
            case ".png":
                contentType = "image/png";
                break;
            case ".jpg":
                contentType = "image/jpg";
                break;
        }

        builder.build(filePath)

        fs.readFile(filePath, function (error, content) {
            if (error) {
                if (error.code === "ENOENT") {
                    response.end("404 Not Found");
                } else {
                    response.writeHead(500);
                    response.end("Error " + error.code);
                }
            } else {
                response.writeHead(200, {"Content-Type": contentType});
                response.end(content, "utf-8");
            }
        });

    }).listen(8000, "127.0.0.1");

    console.log("Node server running on http://127.0.0.1:8000");

    const opn = require("opn");
    opn("http://127.0.0.1:8000");
}

module.exports = {
    serve: serve,
}