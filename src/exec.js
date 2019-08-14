// exec.js

const Whodis = require('./wappalyzer.js')

const options = {
	debug: false,
	delay: 500,
	htmlMaxCols: 2000,
	htmlMaxRows: 2000,
	maxDepth: 3,
	maxUrls: 10,
	maxWait: 5000,
	recursive: true,
	userAgent: "WhoDis",
}

const whodis = new Whodis(options)

let url = process.argv.slice(2)

whodis.Scan(url)
