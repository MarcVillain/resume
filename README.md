Personal resume template
===

This is the repository I use to generate my resume from a json file.

It was greatly inspired by the [jsonresume](https://github.com/jsonresume) project.

## Getting started

To get started, this is what you'll need:

- [node.js](http://howtonode.org/how-to-install-nodejs)
- [npm](http://howtonode.org/introduction-to-npm)

If you're on Linux, you can simply run:

```
sudo apt-get install nodejs-legacy npm
```

Or if you're on OSX and got [Homebrew](http://brew.sh/) installed:
```
brew install node
```

### Install locally

```bash
npm install
node . --help
```

### Install globally

```bash
npm install -g .
resume --help
```

### Your resume data

Commands read your resume from a JSON file (`resume.json` in the current
directory by default, override with `--input`/`-i`). Copy
[`examples/resume.json`](examples/resume.json) to get started, following the
[jsonresume](https://jsonresume.org/schema/) schema.

## How to use

### Live reload

Serves the rendered resume on `http://127.0.0.1:8000`, re-rendering it from
the input file on every request so edits show up on refresh.

```bash
node . serve
```

Options:

| Option           | Default        | Description                                 |
|------------------|----------------|----------------------------------------------|
| `--input`, `-i`  | `resume.json`  | Path to the resume JSON file                |
| `--port`, `-p`   | `8000`         | Port to serve the resume on                 |
| `--open`         | `true`         | Open the resume in a browser automatically  |

### Build

Renders the resume to a standalone HTML or PDF file, determined by the output
file's extension.

```bash
node . build resume.pdf
node . build resume.html --input resume-fr.json
```

Options:

| Option          | Default       | Description                                              |
|-----------------|---------------|------------------------------------------------------------|
| `output`        | `resume.pdf`  | Output file path, `.html` or `.pdf`                       |
| `--input`, `-i` | `resume.json` | Path to the resume JSON file                              |

PDF generation uses [Puppeteer](https://pptr.dev/). If it can't launch Chromium
in your environment (e.g. in a container or CI without a sandbox), set:

```bash
RESUME_PUPPETEER_NO_SANDBOX=1 node . build resume.pdf
```

## License

Available under [the MIT license](http://mths.be/mit).
