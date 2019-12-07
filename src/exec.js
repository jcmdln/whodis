// exec.js

const Whodis = require('../lib/wappalyzer.js')

const whodis = new Whodis({
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

let url = process.argv.slice(2)[0]

whodis.Scan(url)
