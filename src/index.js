#!/usr/bin/env node

const builder = require("./builder");
const server = require("./server");

require("yargs")
    .usage("Usage: $0 <command> [options]")
    .command(
        "build [output]",
        "Render the resume to an HTML or PDF file.",
        (cmd) =>
            cmd
                .positional("output", {
                    describe: "Output file path, extension determines the format (.html or .pdf)",
                    type: "string",
                    default: "resume.pdf",
                })
                .option("input", {
                    alias: "i",
                    describe: "Path to the resume JSON file",
                    type: "string",
                    default: "resume.json",
                }),
        (argv) => {
            builder
                .build(argv.input, argv.output)
                .then(() => console.log(`Built ${argv.output} from ${argv.input}`))
                .catch((err) => {
                    console.error(`Error: ${err.message}`);
                    process.exitCode = 1;
                });
        }
    )
    .command(
        "serve",
        "Serve the resume with live reload.",
        (cmd) =>
            cmd
                .option("input", {
                    alias: "i",
                    describe: "Path to the resume JSON file",
                    type: "string",
                    default: "resume.json",
                })
                .option("port", {
                    alias: "p",
                    describe: "Port to serve the resume on",
                    type: "number",
                    default: 8000,
                })
                .option("open", {
                    describe: "Open the resume in a browser automatically",
                    type: "boolean",
                    default: true,
                }),
        (argv) => {
            server.serve({ input: argv.input, port: argv.port, open: argv.open });
        }
    )
    .demandCommand(1, "You must specify a command.")
    .strict()
    .help()
    .argv;
