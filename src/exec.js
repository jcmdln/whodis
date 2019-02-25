// exec.js
'use-scrict';

const Wapp = require('./lib/wappalyzer.js')

const wapp = new Wapp({
	debug: false,
	delay: 500,
	htmlMaxCols: 2000,
	htmlMaxRows: 2000,
	maxDepth: 3,
	maxUrls: 10,
	maxWait: 5000,
	recursive: true,
	userAgent: "WhoDis",
})

let url = process.argv.slice(2)
wapp.Scan(url)
