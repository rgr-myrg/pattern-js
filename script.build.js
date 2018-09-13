const fs = require('fs');
const concat = require('concat');
const filename = 'dist/pattern-js.js';

const header = 'dist/tmp.header';
const footer = 'dist/tmp.footer';

const date = new Date();
const today = date.toDateString() + ' ' + date.toLocaleTimeString();

const version = fs.readFileSync('package.json').toString().match(/\"version\":\s\"(.+)\",\n/)[1];
const license = fs.readFileSync('LICENSE').toString()
                .replace(/\{date\}/g, today)
                .replace(/\{version\}/g, version);

fs.existsSync(filename) && fs.unlinkSync(filename);

fs.appendFileSync(header, license + "(function(){");
fs.appendFileSync(footer, "})();");

concat([
	"dist/tmp.header",
    "src/js/_core.js",
    "src/js/Notifier.js",
    "src/js/Observable.js",
    "src/js/Observer.js",
    "src/js/Publisher.js",
    "src/js/Receiver.js",
    "src/js/Signal.js",
    "src/js/_export.js",
	"dist/tmp.footer"
], filename);

fs.unlinkSync(header);
fs.unlinkSync(footer);
