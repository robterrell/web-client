const https = require('https');
const url = require('url');
const fs = require('fs');

const options = {
	key: fs.readFileSync('example/devlocal.info.key'),
	cert: fs.readFileSync('example/devlocal.info.cert'),
};

const mimes = {
	css  : 'text/css',
	html : 'text/html',
	js   : 'application/javascript',
	wasm : 'application/wasm',
};

const paths = {
	css  : './example',
	html : './example',
	js   : './src',
	wasm : './src',
};

function zeroPad(num) {
	return num < 10 ? '0' + num : num;
}

function timeStamp() {
	const d = new Date();
	return `${zeroPad(d.getMonth() + 1)}-${zeroPad(d.getDate())} ` +
		`${zeroPad(d.getHours())}:${zeroPad(d.getMinutes())}:${zeroPad(d.getSeconds())}`;
}

https.createServer(options, (req, res) => {
	const parsed = url.parse(req.url);
	const fileName = parsed.pathname === '/' ? '/index.html' : parsed.pathname;
	const fileType = fileName.split('.').slice(-1)[0];
	const fullPath = (paths[fileType] || '.') + fileName;

	let code = 404;
	let color = '\x1b[31m';
	let body = '404';

	if (fs.existsSync(fullPath)) {
		code = 200;
		color = '\x1b[32m';
		body = fs.readFileSync(fullPath);
	}

	console.log(`${color}%s\x1b[0m %s`, code, `[${timeStamp()}] ${fullPath}`);
	res.writeHead(code, {'Content-Type': mimes[fileType] || 'text/plain'});
	res.end(body);

}).listen(443);

console.log('Development server started on port 443');
