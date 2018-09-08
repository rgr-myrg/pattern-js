const fs = require('fs');
const concat = require('concat');
const filename = 'dist/pattern-js.js';
const header = 'dist/tmp.header';
const footer = 'dist/tmp.footer';
const date = new Date();

let mth = date.getMonth() + 1;
let str = '/* pattern-js v1.2.0 - '
		+ date.getDate() + '/' + mth + '/' + date.getFullYear()
		+ ' */\n';

fs.existsSync(filename) && fs.unlinkSync(filename);

fs.appendFileSync(header, str + "(function(){");
fs.appendFileSync(footer, "})();");

concat([
	"dist/tmp.header",
    "src/js/_core.js",
    "src/js/EventSignal.js",
    "src/js/Notifier.js",
    "src/js/Observable.js",
    "src/js/Observer.js",
    "src/js/Publisher.js",
    "src/js/Receiver.js",
	"dist/tmp.footer"
], filename);

fs.unlinkSync(header);
fs.unlinkSync(footer);
