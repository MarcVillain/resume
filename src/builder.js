const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");
const puppeteer = require("puppeteer");
const btoa = require("btoa");

const ROOT_DIR = path.join(__dirname, "..");

Handlebars.registerHelper("ifOr", function (v1, v2, options) {
    if (v1 || v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});

function registerPartials() {
    const partialsDir = path.join(ROOT_DIR, "sections");
    for (const filename of fs.readdirSync(partialsDir)) {
        const matches = /^([^.]+)\.hbs$/.exec(filename);
        if (!matches) {
            continue;
        }
        const template = fs.readFileSync(path.join(partialsDir, filename), "utf8");
        Handlebars.registerPartial(matches[1], template);
    }
}

/**
 * Render the resume at `inputPath` to an HTML string.
 */
function render(inputPath) {
    const css = fs.readFileSync(path.join(ROOT_DIR, "style.css"), "utf-8");
    const tpl = fs.readFileSync(path.join(ROOT_DIR, "resume.hbs"), "utf-8");
    const resume = JSON.parse(fs.readFileSync(inputPath, "utf-8"));

    registerPartials();

    return Handlebars.compile(tpl)({ css, resume });
}

async function buildPdf(html, outputPath) {
    const launchArgs = process.env.RESUME_PUPPETEER_NO_SANDBOX ? ["--no-sandbox"] : [];
    const browser = await puppeteer.launch({ args: launchArgs });

    try {
        const page = await browser.newPage();
        await page.emulateMediaType("print");
        await page.goto(`data:text/html;base64,${btoa(unescape(encodeURIComponent(html)))}`, {
            waitUntil: "networkidle0",
        });
        await page.setViewport({ width: 1920, height: 1080 });
        await page.pdf({
            path: outputPath,
            format: "A4",
            printBackground: true,
            margin: { top: "0", right: "0", bottom: "0", left: "0" },
        });
    } finally {
        await browser.close();
    }
}

/**
 * Render the resume at `inputPath` and write it to `outputPath`.
 * The output format (HTML or PDF) is inferred from the file extension.
 */
async function build(inputPath, outputPath) {
    const html = render(inputPath);
    const extension = path.extname(outputPath).slice(1).toLowerCase();

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    switch (extension) {
        case "html":
            fs.writeFileSync(outputPath, html);
            break;
        case "pdf":
            await buildPdf(html, outputPath);
            break;
        default:
            throw new Error(`unsupported output format ".${extension}" (expected .html or .pdf)`);
    }
}

module.exports = {
    render,
    build,
};
