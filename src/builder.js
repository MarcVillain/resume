const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");
const puppeteer = require("puppeteer");
const btoa = require("btoa");

function render(resume) {
    const css = fs.readFileSync(__dirname + "/../style.css", "utf-8");
    const tpl = fs.readFileSync(__dirname + "/../resume.hbs", "utf-8");
    const partialsDir = path.join(__dirname, "/../sections");
    const filenames = fs.readdirSync(partialsDir);

    Handlebars.registerHelper('ifOr', function(v1, v2, options) {
        if(v1 || v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    });

    filenames.forEach(function (filename) {
        const matches = /^([^.]+).hbs$/.exec(filename);
        if (!matches) {
            return;
        }
        const name = matches[1];
        const filepath = path.join(partialsDir, filename);
        const template = fs.readFileSync(filepath, "utf8");

        Handlebars.registerPartial(name, template);
    });

    return Handlebars.compile(tpl)({
        css: css,
        resume: resume
    });
}

function build_html(filePath, html) {
    fs.writeFile(filePath, html, function(err){
        if (err) console.log(err);
    });
}

const build_pdf = (filePath, html) => {
    (async () => {
        const puppeteerLaunchArgs = [];

        if (process.env.RESUME_PUPPETEER_NO_SANDBOX) {
            puppeteerLaunchArgs.push("--no-sandbox");
        }

        const browser = await puppeteer.launch({
            args: puppeteerLaunchArgs,
        });
        const page = await browser.newPage();

        await page.emulateMediaType("print");
        await page.goto(
            `data:text/html;base64,${btoa(unescape(encodeURIComponent(html)))}`,
            { waitUntil: "networkidle0" },
        );
        await page.pdf({
            path: filePath,
            format: "A4",
            printBackground: true,
        });

        await browser.close();
    })()
        .then(function(){ console.log("Done."); })
        .catch(function(err){ if (err) console.log("Error: " + err); })
};

function build(filePath, callbackError, callbackSuccess) {
    const rawData = fs.readFileSync("resume.json");
    let resume = undefined;
    try {
        resume = JSON.parse(rawData);
    } catch(e) {
        console.log(e);
        callbackError({message:e});
        return;
    }

    const html = render(resume);
    const dir = path.dirname(filePath);
    const basename = path.basename(filePath);
    fs.mkdir(dir, { recursive: true }, (err) => {
        if (err) console.log(err);
    });

    const file = basename.split(".")
    const type = file[file.length - 1]

    switch (type) {
        case "html":
            build_html(filePath, html);
            break;
        case "pdf":
            build_pdf(filePath, html);
            break;
        default:
            const errMsg = "warning: unable to build '" + filePath + "'";
            console.log(errMsg);
            callbackError({message:errMsg});
            break;
    }

    callbackSuccess();
}

module.exports = {
    build: build,
};
