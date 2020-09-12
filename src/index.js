#!/usr/bin/env node

const builder = require("./builder")
const server = require("./server")

const argv = require("yargs")
    .usage("Usage: resume <serve|build> [options]")
    .command(["build <filename>"], "Build the resume.", {})
    .command(["serve"], "Serve the resume.", {})
    .argv;

if (argv._.includes("build")) {
    builder.build(argv.filename)
} else if (argv._.includes("serve")) {
    server.serve()
}
