// wappalyzer.js
'use-scrict';

const Wappalyzer = require('wappalyzer');

const Log = require('./log.js')
const log = new Log("wappalyzer")

class Whodis {
	constructor(Options) {
		this.options = Options
		this.result = {}
	}

	Parse(Data) {
		let parsed = {
			"url": Object.keys(Data.urls)[0]
		}

		for (let a in Data.applications) {
			let app = Data.applications[a]

			if (app.version !== null && app.version !== "") {
				parsed[app.name] = app.version
			} else {
				parsed[app.name] = true
			}
		}

		return this.result = parsed
	}

	Scan(url) {
		if (!url.includes("http://") && !url.includes("https://")) {
			url = "https://" + url
		}

		//
		const wappalyzer = new Wappalyzer(url, this.options)

		wappalyzer.analyze().then(data => {
			return this.Parse(data)
		}).then(res => {
			console.log(JSON.stringify(res, null, 4))
			process.exit(0)
		}).catch(err => {
			log.Fatal(err)
			process.exit(1)
		})
	}
}

module.exports = Whodis
