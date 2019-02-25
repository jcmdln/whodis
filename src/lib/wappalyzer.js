// wappalyzer.js

const Log = require('./log.js')
const Wappalyzer = require('wappalyzer')
const Browser = require('../../node_modules/wappalyzer/browsers/zombie.js')

const log = new Log("wappalyzer")


class Wapp {
	constructor(Options) {
		this.options = Options
		this.result  = {}
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
		// TODO: figure out why this isn't working
		// if (!url.includes(".")) {
		// 	log.Fatal("'"+ url + "'" + " is not a domain!")
		// }

		if (!url.includes("http://") && !url.includes("https://")) {
			url = "https://" + url
		}

		new Wappalyzer(Browser, url, this.options).analyze().then(data => {
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

module.exports = Wapp
