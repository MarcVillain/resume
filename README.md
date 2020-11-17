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

### Install and build locally

```bash
sudo npm install .
node . --help
```

### Install and build globally

```bash
sudo npm install -g .
resume --help
```

## How to use

### Live reload

```bash
node . serve
```

### Build

```bash
node . build resume.pdf
```

## License

Available under [the MIT license](http://mths.be/mit).
